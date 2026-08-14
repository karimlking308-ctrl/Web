import { AIAnalysis } from '../types';

export interface AIService {
  getAnalysisForArticle(articleId?: string): Promise<AIAnalysis | null>;
  getMarketBriefAnalysis(): Promise<AIAnalysis>;
}

export const placeholderAIAnalysis: AIAnalysis = {
  id: 'pulse-ai-brief-sample',
  headline: 'PULSE AI Market Intelligence Framework',
  summary: 'Real-time multi-factor financial synthesis and institutional context powered by live crypto market data and breaking financial news.',
  whyItMatters: [
    'Provides multi-source contextual synthesis across macro, equity, and digital asset sectors.',
    'Highlights key market catalyst timelines and institutional positioning changes.',
    'Isolates volatility drivers from underlying long-term fundamental trends.'
  ],
  marketImpact: {
    overview: 'Dynamic impact evaluations assess cross-asset volatility and liquidity changes.',
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
  marketContext: 'AI model benchmarks current price developments against historic averages and sector momentum metrics.',
  disclaimer: 'AI-generated analysis is for informational purposes only and is not financial advice.',
  generatedAt: new Date().toISOString()
};

export const aiService: AIService = {
  async getAnalysisForArticle(articleId?: string): Promise<AIAnalysis | null> {
    try {
      const url = articleId ? `/api/analysis?articleId=${encodeURIComponent(articleId)}` : '/api/analysis';
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      return placeholderAIAnalysis;
    } catch (err) {
      console.warn('[AIService] Failed to fetch live AI analysis, using structured fallback:', err);
      return placeholderAIAnalysis;
    }
  },

  async getMarketBriefAnalysis(): Promise<AIAnalysis> {
    try {
      const res = await fetch('/api/analysis', { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      return placeholderAIAnalysis;
    } catch (err) {
      console.warn('[AIService] Failed to fetch market brief analysis:', err);
      return placeholderAIAnalysis;
    }
  }
};
