// Re-export all copilot services
export { llmClient } from './llm-client.service';
export { summarizerService } from './summarizer.service';
export { reportGeneratorService } from './report-generator.service';
export { riskFlaggerService } from './risk-flagger.service';

// Export types
export * from './types';

// Export prompt builders
export * from './prompts/executive-summary';
export * from './prompts/layer-analysis';
export * from './prompts/recommendations';
