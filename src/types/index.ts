export type ToolCategory = 'image' | 'pdf' | 'code' | 'text' | 'calculators' | 'converters';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  badgeColor: string;
  bgGradient: string;
  iconBg: string;
  iconColor: string;
}

export interface ToolHowToStep {
  step: number;
  title: string;
  desc: string;
}

export interface ToolFAQ {
  q: string;
  a: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: ToolCategory;
  icon: string;
  isPopular?: boolean;
  badge?: string;
  features: string[];
  featuresAr: string[];
  howToUse: ToolHowToStep[];
  howToUseAr: ToolHowToStep[];
  faqs: ToolFAQ[];
  faqsAr: ToolFAQ[];
  relatedToolIds: string[];
  keywords: string[];
  keywordsAr: string[];
}

export type Language = 'en' | 'ar';
export type ThemeMode = 'light' | 'dark';
