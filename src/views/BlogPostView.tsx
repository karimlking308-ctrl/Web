import React from 'react';
import { BlogArticle } from '../data/blogArticles';
import { ArrowLeft, Calendar, Clock, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

interface BlogPostViewProps {
  article: BlogArticle;
  onBackToBlog: () => void;
  onNavigateHome: () => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({
  article,
  onBackToBlog,
  onNavigateHome,
}) => {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: 'https://www.tindry.com/opengraph-image',
    author: {
      '@type': 'Person',
      name: article.author,
      jobTitle: 'Founder & Software Engineer',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Salé',
        addressCountry: 'Morocco',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tindry',
      url: 'https://www.tindry.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tindry.com/favicon.svg',
      },
    },
    datePublished: '2026-10-28',
    dateModified: '2026-10-28',
    mainEntityOfPage: `https://www.tindry.com/blog/${article.slug}`,
    keywords: article.keywords,
  };

  return (
    <article className="max-w-3xl mx-auto py-2">
      {/* JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 flex-wrap">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="hover:text-black transition-colors"
        >
          Home
        </a>
        <span>/</span>
        <a
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            onBackToBlog();
          }}
          className="hover:text-black transition-colors"
        >
          Blog
        </a>
        <span>/</span>
        <span className="text-black font-medium truncate max-w-xs sm:max-w-md">
          {article.title}
        </span>
      </nav>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 mb-3 flex-wrap">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{article.date}</span>
          </span>
          <span>&middot;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </span>
          <span>&middot;</span>
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            <span>Zero Uploads</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author Box at Top */}
        <div className="mt-6 p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-black">{article.authorBio}</p>
              <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>Salé, Morocco &middot; Building privacy-first software</span>
              </p>
            </div>
          </div>
          <a
            href={article.toolLink}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Try it offline <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="prose prose-neutral max-w-none space-y-8 text-neutral-800 leading-relaxed text-sm sm:text-base">
        {article.content.sections.map((section, idx) => {
          return (
            <section key={idx} className="space-y-4">
              {/* Headings */}
              {section.heading && section.level === 'h2' && (
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black mt-8 pt-4 border-t border-neutral-100">
                  {section.heading}
                </h2>
              )}
              {section.heading && section.level === 'h3' && (
                <h3 className="text-lg font-bold text-black mt-6">
                  {section.heading}
                </h3>
              )}

              {/* Paragraphs */}
              {section.paragraphs &&
                section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed text-neutral-700">
                    {p}
                  </p>
                ))}

              {/* Steps (if present) */}
              {section.steps && (
                <div className="space-y-4 my-6">
                  {section.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-xl border border-neutral-200 bg-white"
                    >
                      <h3 className="font-bold text-black text-sm mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Comparison Table (if present) */}
              {section.table && (
                <div className="overflow-x-auto my-6 border border-neutral-200 rounded-xl">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-neutral-100 border-b border-neutral-200">
                        {section.table.headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            className="py-3 px-4 font-bold text-black text-xs uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {section.table.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={rIdx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/60'}
                        >
                          <td className="py-3 px-4 font-semibold text-black">
                            {row[0]}
                          </td>
                          <td className="py-3 px-4 text-neutral-500">
                            {row[1]}
                          </td>
                          <td className="py-3 px-4 font-medium text-emerald-800 bg-emerald-50/50">
                            {row[2]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* FAQs (if present) */}
              {section.faqs && (
                <div className="space-y-4 my-6">
                  {section.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-4 rounded-xl border border-neutral-200 bg-neutral-50"
                    >
                      <h3 className="font-bold text-black text-sm mb-2">
                        Q: {faq.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Author Box at Bottom */}
      <div className="mt-12 pt-8 border-t border-neutral-200">
        <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-black text-white font-bold text-base flex items-center justify-center flex-shrink-0">
              A
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-black">
                About the Author: {article.authorBio}
              </h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Hi, I am Abdo. I build lightweight, privacy-focused web tools from Salé, Morocco. I created Tindry because I believe essential daily file utilities like PDF merging and image compression should never compromise personal confidentiality or send your files to remote servers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="my-10 p-6 rounded-2xl bg-neutral-900 text-white text-center">
        <h2 className="text-lg sm:text-xl font-bold mb-2">
          Ready to experience 100% private file tools?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-5">
          Process your files locally in your browser with zero cloud uploads and complete offline privacy.
        </p>
        <a
          href={article.toolLink}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-xs sm:text-sm font-bold hover:bg-neutral-100 transition-colors"
        >
          {article.toolLinkText}
        </a>
      </div>

      {/* Back to Blog Button */}
      <div className="pt-6 border-t border-neutral-200 flex items-center justify-between text-xs">
        <button
          onClick={onBackToBlog}
          className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </button>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="text-neutral-500 hover:text-black transition-colors"
        >
          Return to Tindry Tools
        </a>
      </div>
    </article>
  );
};
