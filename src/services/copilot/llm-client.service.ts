import OpenAI from 'openai';
import { logger } from '@/lib/logger';
import { LLMRequest, LLMResponse } from './types';

/**
 * LLM Client Service
 * Unified interface for OpenAI GPT-5 Pro (primary)
 * Handles rate limiting, retries, and token tracking
 */
class LLMClientService {
    private client: OpenAI;
    private model: string;
    private maxRetries: number = 3;
    private retryDelay: number = 1000;

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            logger.warn('OPENAI_API_KEY not configured', {
                service: 'LLMClientService',
                method: 'constructor'
            });
        }

        this.client = new OpenAI({
            apiKey: apiKey || 'sk-placeholder'
        });

        this.model = process.env.LLM_MODEL || 'gpt-5-pro';
    }

    /**
     * Complete a prompt using the LLM
     */
    async complete(request: LLMRequest): Promise<LLMResponse> {
        const maxTokens = request.maxTokens || 4096;
        const temperature = request.temperature ?? 0.3;

        logger.info('LLM completion request', {
            service: 'LLMClientService',
            method: 'complete',
            model: this.model,
            promptLength: request.prompt.length
        });

        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

                if (request.systemPrompt) {
                    messages.push({
                        role: 'system',
                        content: request.systemPrompt
                    });
                }

                messages.push({
                    role: 'user',
                    content: request.prompt
                });

                const response = await this.client.chat.completions.create({
                    model: this.model,
                    messages,
                    max_tokens: maxTokens,
                    temperature
                });

                const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

                logger.info('LLM completion success', {
                    service: 'LLMClientService',
                    method: 'complete',
                    model: response.model,
                    tokensUsed: usage.total_tokens
                });

                return {
                    content: response.choices[0]?.message?.content || '',
                    model: response.model,
                    usage: {
                        promptTokens: usage.prompt_tokens,
                        completionTokens: usage.completion_tokens,
                        totalTokens: usage.total_tokens
                    }
                };
            } catch (error) {
                lastError = error as Error;

                logger.warn('LLM completion attempt failed', {
                    service: 'LLMClientService',
                    method: 'complete',
                    attempt,
                    error: lastError.message
                });

                if (attempt < this.maxRetries) {
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }

        logger.error('LLM completion failed after retries', lastError!, {
            service: 'LLMClientService',
            method: 'complete'
        });

        throw lastError;
    }

    /**
     * Stream completion (for real-time responses)
     */
    async *streamComplete(request: LLMRequest): AsyncGenerator<string> {
        const maxTokens = request.maxTokens || 4096;
        const temperature = request.temperature ?? 0.3;

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

        if (request.systemPrompt) {
            messages.push({
                role: 'system',
                content: request.systemPrompt
            });
        }

        messages.push({
            role: 'user',
            content: request.prompt
        });

        const stream = await this.client.chat.completions.create({
            model: this.model,
            messages,
            max_tokens: maxTokens,
            temperature,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    }

    /**
     * Check if LLM is configured and available
     */
    isConfigured(): boolean {
        return !!process.env.OPENAI_API_KEY;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const llmClient = new LLMClientService();
