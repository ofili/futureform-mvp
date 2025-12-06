import { evidenceFactService } from '../evidence-facts/evidence-fact.service';
import { FactType, FactSource } from '@prisma/client';
import { logger } from '@/lib/logger';

// Interface for NewsAPI response
interface NewsArticle {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

export class NewsAgentService {
    private apiKey: string;
    private baseUrl = 'https://newsapi.org/v2';

    constructor() {
        this.apiKey = process.env.NEWS_API_KEY || '';
    }

    /**
     * Search for news about a company or topic
     */
    async searchNews(
        query: string,
        assessmentId: string,
        limit: number = 5
    ): Promise<void> {
        if (!this.apiKey) {
            logger.warn('NewsAPI key not configured', {
                service: 'NewsAgentService',
                method: 'searchNews'
            });
            return;
        }

        try {
            logger.info('Searching news', {
                service: 'NewsAgentService',
                method: 'searchNews',
                query,
                assessmentId
            });

            // Calculate date range (last 6 months)
            const fromDate = new Date();
            fromDate.setMonth(fromDate.getMonth() - 6);
            const fromDateStr = fromDate.toISOString().split('T')[0];

            const url = `${this.baseUrl}/everything?q=${encodeURIComponent(query)}&from=${fromDateStr}&sortBy=relevancy&pageSize=${limit}&language=en&apiKey=${this.apiKey}`;

            const response = await fetch(url);
            const data: NewsAPIResponse = await response.json();

            if (data.status !== 'ok') {
                throw new Error(`NewsAPI error: ${JSON.stringify(data)}`);
            }

            // Process and store articles
            for (const article of data.articles) {
                await this.storeArticleAsFact(article, assessmentId);
            }

            logger.info('News search completed', {
                service: 'NewsAgentService',
                method: 'searchNews',
                articlesFound: data.totalResults,
                articlesProcessed: data.articles.length
            });

        } catch (error) {
            logger.error('Failed to search news', error as Error, {
                service: 'NewsAgentService',
                method: 'searchNews',
                query
            });
            throw error;
        }
    }

    /**
     * Store a news article as an EvidenceFact
     */
    private async storeArticleAsFact(article: NewsArticle, assessmentId: string): Promise<void> {
        const content = `
Title: ${article.title}
Source: ${article.source.name}
Date: ${article.publishedAt}
Description: ${article.description || 'No description'}
        `.trim();

        await evidenceFactService.createFact({
            assessmentId,
            factType: FactType.EXTERNAL_NEWS,
            source: FactSource.NEWS_API,
            rawContent: content,
            sourceUrl: article.url,
            collectedBy: 'AGENT:NEWS_API',
            confidence: 0.8 // Default confidence for news
        });
    }
}

export const newsAgentService = new NewsAgentService();
