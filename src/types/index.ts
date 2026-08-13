export type Category = 
  | 'markets' 
  | 'crypto' 
  | 'stocks' 
  | 'economy' 
  | 'technology' 
  | 'analysis' 
  | 'trending';

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  category: Category;
  source: string;
  sourceUrl?: string;
  imageUrl?: string;
  publishedAt: string;
  tags: string[];
  tickers?: string[];
  readTimeMinutes?: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type MarketAssetType = 'crypto' | 'index' | 'commodity' | 'forex' | 'stock';

export interface MarketAsset {
  symbol: string;
  name: string;
  type: MarketAssetType;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  volume?: string;
  status: 'active' | 'closed' | 'placeholder';
  updatedAt: string;
}

export interface MarketMoversData {
  gainers: MarketAsset[];
  losers: MarketAsset[];
  mostActive: MarketAsset[];
}

export interface AIAnalysis {
  id: string;
  articleId?: string;
  headline: string;
  summary: string;
  whyItMatters: string[];
  marketImpact: {
    overview: string;
    level: 'high' | 'medium' | 'low';
    sentiment: 'bullish' | 'bearish' | 'neutral';
  };
  bullishFactors: string[];
  bearishFactors: string[];
  keyRisks: string[];
  marketContext: string;
  disclaimer: string;
  generatedAt: string;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  status: 'pending' | 'subscribed';
}

export interface AdSlotProps {
  variant: 'sidebar' | 'inline' | 'banner' | 'native';
  className?: string;
  id?: string;
}

export interface NavItem {
  label: string;
  path: string;
  category?: Category;
  badge?: string;
}
