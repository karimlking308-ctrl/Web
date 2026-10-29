import React from 'react';
import { BlogPostView } from '../../../src/views/BlogPostView';
import { getArticleBySlug } from '../../../src/data/blogArticles';

const article = getArticleBySlug('why-offline-pdf-tools-are-safer')!;

export const metadata = {
  title: article.metaTitle,
  description: article.metaDescription,
  alternates: { canonical: `https://www.tindry.com/blog/${article.slug}` },
  openGraph: {
    title: article.metaTitle,
    description: article.metaDescription,
    url: `https://www.tindry.com/blog/${article.slug}`,
    siteName: 'Tindry',
    type: 'article',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: article.metaTitle,
    description: article.metaDescription,
    images: ['/opengraph-image'],
  },
};

export default function ArticlePage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <BlogPostView
        article={article}
        onBackToBlog={() => {
          if (typeof window !== 'undefined') window.location.href = '/blog';
        }}
        onNavigateHome={() => {
          if (typeof window !== 'undefined') window.location.href = '/';
        }}
      />
    </div>
  );
}
