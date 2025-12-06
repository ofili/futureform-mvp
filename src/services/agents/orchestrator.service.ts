import { newsAgentService } from './news-agent.service';
import { registryAgentService } from './registry-agent.service';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { JobStatus } from '@prisma/client';

export interface CreateJobInput {
    assessmentId: string;
    partnerName: string;
    rcNumber?: string;
}

/**
 * Orchestrator Service
 * Manages the execution of research agents using a DB-backed queue
 */
export class OrchestratorService {
    /**
     * Create and start a research job
     */
    async startResearchJob(input: CreateJobInput): Promise<string> {
        logger.info('Creating research job', {
            service: 'OrchestratorService',
            method: 'startResearchJob',
            assessmentId: input.assessmentId,
            partnerName: input.partnerName
        });

        // Create job in DB
        const job = await prisma.researchJob.create({
            data: {
                assessmentId: input.assessmentId,
                partnerName: input.partnerName,
                rcNumber: input.rcNumber,
                status: JobStatus.PENDING
            }
        });

        // Start async processing (fire and forget)
        this.processJob(job.id).catch(err => {
            logger.error('Unhandled error in job processing', err as Error, {
                service: 'OrchestratorService',
                method: 'processJob',
                jobId: job.id
            });
        });

        return job.id;
    }

    /**
     * Get job status from DB
     */
    async getJobStatus(jobId: string) {
        return await prisma.researchJob.findUnique({
            where: { id: jobId }
        });
    }

    /**
     * Get all jobs for an assessment
     */
    async getJobsForAssessment(assessmentId: string) {
        return await prisma.researchJob.findMany({
            where: { assessmentId },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Process pending jobs (can be called by a cron/scheduler)
     */
    async processPendingJobs(): Promise<void> {
        const pendingJobs = await prisma.researchJob.findMany({
            where: { status: JobStatus.PENDING },
            take: 10, // Process up to 10 at a time
            orderBy: { createdAt: 'asc' }
        });

        for (const job of pendingJobs) {
            await this.processJob(job.id);
        }
    }

    /**
     * Process a single job
     */
    private async processJob(jobId: string): Promise<void> {
        try {
            // Update status to RUNNING
            await prisma.researchJob.update({
                where: { id: jobId },
                data: {
                    status: JobStatus.RUNNING,
                    startedAt: new Date()
                }
            });

            const job = await prisma.researchJob.findUnique({
                where: { id: jobId }
            });

            if (!job) {
                throw new Error('Job not found');
            }

            logger.info('Processing research job', {
                service: 'OrchestratorService',
                method: 'processJob',
                jobId,
                partner: job.partnerName
            });

            // Run agents in parallel
            await Promise.all([
                // 1. News Search
                newsAgentService.searchNews(job.partnerName, job.assessmentId)
                    .catch(err => logger.error('News agent failed', err as Error, { service: 'OrchestratorService', method: 'processJob', jobId })),

                // 2. Registry Check (Nigeria via Mono CAC)
                registryAgentService.checkRegistration(job.partnerName, job.assessmentId, job.rcNumber || undefined)
                    .catch(err => logger.error('Registry agent failed', err as Error, { service: 'OrchestratorService', method: 'processJob', jobId }))
            ]);

            // Update status to COMPLETED
            await prisma.researchJob.update({
                where: { id: jobId },
                data: {
                    status: JobStatus.COMPLETED,
                    completedAt: new Date()
                }
            });

            logger.info('Research job completed', {
                service: 'OrchestratorService',
                method: 'processJob',
                jobId
            });

        } catch (error) {
            // Update status to FAILED
            await prisma.researchJob.update({
                where: { id: jobId },
                data: {
                    status: JobStatus.FAILED,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    completedAt: new Date()
                }
            });

            logger.error('Research job failed', error as Error, {
                service: 'OrchestratorService',
                method: 'processJob',
                jobId
            });
        }
    }
}

export const orchestratorService = new OrchestratorService();
