import React from 'react';
import { BLOG_ARTICLES, BlogArticle } from '../data/blogArticles';
import { Calendar, Clock, ArrowRight, ShieldCheck, User } from 'lucide-react';

interface BlogListViewProps {
  onSelectArticle: (slug: string) => void;
}

export const BlogListView: React.FC<BlogListViewProps> = ({ onSelectArticle }) => {
  return (
    <div className="max-w-5xl mx-auto">
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
        {BLOG_ARTICLES.map((article: BlogArticle) => {
          return (
            <a
              key={article.slug}
              href={`/blog/${article.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectArticle(article.slug);
              }}
              className="group bg-white border border-neutral-200 rounded-xl p-5 hover:border-black transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Meta details badge */}
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{article.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </span>
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
          );
        })}
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
};
