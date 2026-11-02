import React from 'react';
import { Calendar, Clock, ArrowRight, ShieldCheck, User } from 'lucide-react';

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

interface BlogItem {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
}

const BLOG_ARTICLES: BlogItem[] = [
  {
    slug: 'compress-image-without-losing-quality',
    title: 'How to Compress Images Without Losing Quality',
    category: 'Image Tools',
    excerpt: 'Learn how to compress images to 80% smaller without losing quality. Free, private, 100% offline in your browser.',
    date: 'Nov 2, 2026',
    readTime: '6 min read',
    author: 'Abdo',
  },
  {
    slug: 'heic-to-jpg-iphone-photos',
    title: 'Convert HEIC to JPG from iPhone',
    category: 'Image Tools',
    excerpt: "Can't open iPhone HEIC photos on Windows? Convert HEIC to JPG instantly in your browser. Private, no upload, free forever.",
    date: 'Nov 2, 2026',
    readTime: '5 min read',
    author: 'Abdo',
  },
  {
    slug: 'png-to-jpg-converter-guide',
    title: 'PNG to JPG Converter Guide',
    category: 'Image Tools',
    excerpt: 'Convert PNG to JPG in seconds to reduce file size. Keep quality, work offline, no data sent to server.',
    date: 'Nov 2, 2026',
    readTime: '5 min read',
    author: 'Abdo',
  },
  {
    slug: 'webp-to-jpg-why-cant-open',
    title: 'WEBP to JPG Fix',
    category: 'Image Tools',
    excerpt: "Can't open or share WEBP images? Convert WEBP to JPG offline in your browser. Fast, private, zero server uploads.",
    date: 'Nov 2, 2026',
    readTime: '4 min read',
    author: 'Abdo',
  },
  {
    slug: 'image-upscaler-4k-ai',
    title: 'Image Upscaler to 4K AI',
    category: 'AI Tools',
    excerpt: 'Upscale low-resolution photos to 4K clarity directly in your browser. Free client-side AI image super-resolution.',
    date: 'Nov 2, 2026',
    readTime: '5 min read',
    author: 'Abdo',
  },
  {
    slug: 'qr-code-generator-custom',
    title: 'Free QR Code Generator',
    category: 'Tools',
    excerpt: 'Generate custom QR codes for Wi-Fi, URLs, and contacts offline without expired links or tracking redirects.',
    date: 'Nov 2, 2026',
    readTime: '4 min read',
    author: 'Abdo',
  },
  {
    slug: 'jpg-to-pdf-multiple-photos',
    title: 'JPG to PDF Multiple Photos',
    category: 'PDF Tools',
    excerpt: 'Combine multiple JPG photos into a single neat PDF document locally in your browser. 100% private and offline.',
    date: 'Nov 2, 2026',
    readTime: '5 min read',
    author: 'Abdo',
  },
  {
    slug: 'webm-to-mp4-discord-chrome',
    title: 'Convert WebM to MP4',
    category: 'Video Tools',
    excerpt: 'Fix Discord and Apple playback issues by converting WebM recordings to standard MP4 locally in your browser.',
    date: 'Nov 2, 2026',
    readTime: '5 min read',
    author: 'Abdo',
  },
  {
    slug: 'mp4-to-mp3-extract-audio',
    title: 'MP4 to MP3 Extract Audio',
    category: 'Audio Tools',
    excerpt: 'Extract crystal-clear MP3 audio tracks from video files in seconds without uploading large media files to cloud servers.',
    date: 'Nov 2, 2026',
    readTime: '4 min read',
    author: 'Abdo',
  },
  {
    slug: 'pdf-to-word-private-safe',
    title: 'PDF to Word Private Safe',
    category: 'PDF Tools',
    excerpt: 'Convert confidential PDF contracts and forms into editable Word DOCX files with zero server storage or leaks.',
    date: 'Nov 2, 2026',
    readTime: '5 min read',
    author: 'Abdo',
  },
  {
    slug: 'how-to-compress-images-without-uploading',
    title: 'How to Compress Images Without Uploading Them to Cloud Servers',
    category: 'Image Tools',
    excerpt: 'Compress private family photos, passport scans, and design assets directly in your browser with zero server uploads and complete local privacy.',
    date: 'Oct 28, 2026',
    readTime: '5 min read',
    author: 'Abdo',
  },
  {
    slug: 'why-offline-pdf-tools-are-safer',
    title: 'Why Offline PDF Tools Are Far Safer Than Traditional Web Converters',
    category: 'PDF Tools',
    excerpt: 'Bank statements, contracts, and identity documents should never be uploaded to third-party PDF websites. Discover the security benefits of offline PDF processing.',
    date: 'Oct 28, 2026',
    readTime: '6 min read',
    author: 'Abdo',
  },
  {
    slug: 'create-invoices-offline',
    title: 'How to Create and Convert Invoices Offline to Protect Confidential Client Data',
    category: 'Invoice Tools',
    excerpt: 'Freelancers and consultants must protect billing rates, bank account IBANs, and client identities. Learn how to generate and format invoices completely offline.',
    date: 'Oct 28, 2026',
    readTime: '5 min read',
    author: 'Abdo',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Blog Hero Section */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-[11px] font-mono text-neutral-600 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-black" />
          <span>100% Private &middot; Client-Side Computing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black leading-tight mb-2">
          Tindry Blog - Privacy & Offline Tools
        </h1>
        <p className="text-sm text-neutral-600 max-w-2xl">
          Learn how to work 100% offline without risking your files. Practical guides, architecture breakdowns, and data privacy advice from the founder in Salé, Morocco.
        </p>
      </div>

      {/* Articles Grid - Same design system as homepage tools cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        {BLOG_ARTICLES.map((article) => (
          <a
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group bg-white border border-neutral-200 rounded-xl p-5 hover:border-black transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Gradient placeholder */}
              <div className="w-full h-44 bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-xl mb-4" />

              {/* Meta details badge */}
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-700">
                  {article.category}
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{article.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-base font-bold text-black mb-2 group-hover:underline leading-snug">
                {article.title}
              </h2>

              {/* 2-line excerpt */}
              <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                {article.excerpt}
              </p>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-black">
              <span className="flex items-center gap-1 text-neutral-500 font-normal text-[11px]">
                <User className="w-3 h-3" />
                <span>By {article.author}</span>
              </span>
              <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Read guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Trust & Transparency Note */}
      <div className="pt-8 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-500">
        <div>
          <strong className="text-black block mb-0.5">Written from Experience</strong>
          Real-world privacy guides by independent developers in Salé, Morocco.
        </div>
        <div>
          <strong className="text-black block mb-0.5">Zero Cloud Uploads</strong>
          Every recommended method runs purely in your local browser sandbox.
        </div>
        <div>
          <strong className="text-black block mb-0.5">Open & Free</strong>
          No subscriptions, no paywalled articles, and zero tracking cookies.
        </div>
      </div>
    </div>
  );
}
