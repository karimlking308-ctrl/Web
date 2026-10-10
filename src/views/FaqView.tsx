import React from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { SEO_CONFIGS } from '../config/seo';

interface FaqViewProps {
  onSelectTool: (toolId: string) => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onSelectTool }) => {
  const faqs = SEO_CONFIGS.faq.faqItems || [];

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          Find answers to common questions about Tindry&apos;s online file conversion and compression tools.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white"
          >
            <h2 className="text-sm sm:text-base font-bold text-black mb-2 flex items-start gap-2.5">
              <span className="text-neutral-400 font-mono text-xs mt-0.5 select-none">
                Q{idx + 1}.
              </span>
              <span>{faq.question}</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pl-6">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Internal Navigation to tools */}
      <div className="p-6 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-black">
            Ready to process your files?
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Choose from MP4 to MP3, Merge PDF, JPG to PDF, PDF to JPG, or Compress Image.
          </p>
        </div>
        <a
          href="/tools"
          onClick={(e) => {
            e.preventDefault();
            onSelectTool('all-tools');
          }}
          className="inline-flex items-center gap-1.5 py-2.5 px-4 bg-black hover:bg-neutral-800 text-white font-medium text-xs rounded-md transition-colors"
        >
          <span>Explore All Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
