import React from 'react';
import { BlogListView } from '../../src/views/BlogListView';

export const metadata = {
  title: 'Tindry Blog - Privacy & Offline Tools',
  description: 'Learn how to work 100% offline without risking your files. Guides, architecture breakdowns, and data privacy advice from the founder in Salé, Morocco.',
  alternates: { canonical: 'https://www.tindry.com/blog' },
  openGraph: {
    title: 'Tindry Blog - Privacy & Offline Tools',
    description: 'Learn how to work 100% offline without risking your files.',
    url: 'https://www.tindry.com/blog',
    siteName: 'Tindry',
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tindry Blog - Privacy & Offline Tools',
    description: 'Learn how to work 100% offline without risking your files.',
    images: ['/opengraph-image'],
  },
};

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <BlogListView onSelectArticle={(slug) => {
        if (typeof window !== 'undefined') {
          window.location.href = `/blog/${slug}`;
        }
      }} />
    </div>
  );
}
