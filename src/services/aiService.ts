import { AIAnalysis } from '../types';

/**
 * Service interface for AI-Assisted Financial Intelligence.
 * Prepared for Phase 4 integration with Gemini 2.5/Flash model.
 * Phase 1 returns structured placeholders and displays the standard non-advice disclaimer.
 */
export interface AIService {
  getAnalysisForArticle(articleId?: string): Promise<AIAnalysis | null>;
  getMarketBriefAnalysis(): Promise<AIAnalysis>;
}

export const placeholderAIAnalysis: AIAnalysis = {
  id: 'pulse-ai-brief-sample',
  headline: 'PULSE AI Market Intelligence Framework',
  summary: 'AI analysis will appear here once the AI data service is connected in Phase 4. Our model will process real-time market data, regulatory filings, and breaking news into concise institutional insights.',
  whyItMatters: [
    'Provides multi-source contextual synthesis across macro, equity, and digital asset sectors.',
    'Highlights key market catalyst timelines and institutional positioning changes.',
    'Isolates volatility drivers from underlying long-term fundamental trends.'
  ],
  marketImpact: {
    overview: 'Dynamic impact evaluations will assess cross-asset volatility, yield curves, and liquidity changes.',
    level: 'medium',
    sentiment: 'neutral'
  },
  bullishFactors: [
    'Macro liquidity easing signals and resilient institutional balance sheets.',
    'Technological productivity expansion across enterprise software and chip design.',
    'Accelerated capital inflows into tokenized financial assets.'
  ],
  bearishFactors: [
    'Elevated terminal interest rates and persistent sovereign debt refinancing pressure.',
    'Geopolitical supply-chain bottlenecks impacting manufacturing costs.',
    'Valuation compression in cyclical equity sectors.'
  ],
  keyRisks: [
    'Sudden shifts in monetary policy forward guidance.',
    'Commodity price shocks driven by shipping lane disruptions.'
  ],
  marketContext: 'AI models will benchmark current price developments against 10-year historic averages, implied volatility surfaces, and sector momentum metrics.',
  disclaimer: 'AI-generated analysis is for informational purposes only and is not financial advice.',
  generatedAt: 'Phase 1 Architecture Preview'
};

export const aiService: AIService = {
  async getAnalysisForArticle(_articleId?: string): Promise<AIAnalysis | null> {
    return placeholderAIAnalysis;
  },

  async getMarketBriefAnalysis(): Promise<AIAnalysis> {
    return placeholderAIAnalysis;
  }
};
