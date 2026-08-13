import React from 'react';
import { useRouter } from '../context/RouterContext';
import { ArrowLeft, Shield, FileText, Mail, Info, AlertTriangle } from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

interface LegalPageProps {
  pageType: 'about' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'copyright' | 'disclaimer' | 'editorial-policy';
}

const PAGE_DATA = {
  about: {
    title: 'About PULSE',
    subtitle: 'Independent Financial Media & Market Intelligence',
    icon: Info,
    content: (
      <>
        <p>
          <strong>PULSE</strong> is a modern, high-precision digital financial media publication committed to delivering clear, objective, and timely reporting across global equity markets, cryptocurrency assets, macroeconomic developments, and enterprise technology.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">Our Mission</h3>
        <p>
          In a financial world filled with noise and unverified rumors, PULSE stands for clarity, integrity, and analytical depth. We combine factual reporting from reputable sources with institutional-grade AI synthesis to give market participants actionable context without promotional bias.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">Core Values</h3>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li><strong>Real Data Only:</strong> We never generate, invent, or speculate on market numbers or facts.</li>
          <li><strong>Source Attribution:</strong> We strictly attribute reporting to verified primary filings, transcripts, and official releases.</li>
          <li><strong>Analytical Independence:</strong> Editorial decisions remain strictly separate from commercial operations and advertising partnerships.</li>
        </ul>
      </>
    ),
  },
  contact: {
    title: 'Contact PULSE Wire',
    subtitle: 'Editorial Inquiries, Press Releases & Corrections',
    icon: Mail,
    content: (
      <>
        <p>
          We welcome news tips, verified corporate press releases, and editorial feedback from readers and institutional analysts.
        </p>
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase">Editorial Wire Desk</h4>
            <p className="text-xs text-slate-600 mt-1">For press releases, story pitches, and market intelligence tips:</p>
            <p className="text-xs font-mono text-blue-600 font-bold mt-2">editorial@sol-pump.store</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase">Syndication & Advertising</h4>
            <p className="text-xs text-slate-600 mt-1">For commercial sponsorships and newsletter placements:</p>
            <p className="text-xs font-mono text-blue-600 font-bold mt-2">sponsorships@sol-pump.store</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Response times for verified editorial inquiries are typically within 24 business hours.
        </p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Data Protection & Subscriber Confidentiality',
    icon: Shield,
    content: (
      <>
        <p>
          At PULSE, we respect your privacy. This policy outlines how information is collected and protected across our digital platforms.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">1. Information Collection</h3>
        <p>
          PULSE does not require user accounts, passwords, or personal identity profiles to access news and analysis. When subscribing to our PULSE Market Brief, we collect only your email address for the sole purpose of dispatching editorial newsletters.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">2. No Third-Party Data Selling</h3>
        <p>
          We never sell, rent, or lease reader email addresses to advertisers, data brokers, or third parties.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">3. Unsubscribe</h3>
        <p>
          Subscribers may opt out of future mailings at any time with a single click using the unsubscribe link provided in every newsletter dispatch.
        </p>
      </>
    ),
  },
  terms: {
    title: 'Terms of Use',
    subtitle: 'Platform Terms & Conditions of Access',
    icon: FileText,
    content: (
      <>
        <p>
          By accessing PULSE (https://sol-pump.store), you agree to comply with and be bound by these Terms of Use.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">1. Informational Purpose</h3>
        <p>
          All content, quotes, data feeds, and AI-assisted summaries published on PULSE are provided strictly for general informational and educational purposes.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">2. Intellectual Property</h3>
        <p>
          Original editorial articles, designs, brand marks, and software layouts are protected under international copyright and intellectual property laws.
        </p>
      </>
    ),
  },
  cookies: {
    title: 'Cookie Policy',
    subtitle: 'Cookies & Analytical Storage Usage',
    icon: FileText,
    content: (
      <>
        <p>
          PULSE uses minimal standard cookies and client-side storage to remember theme preferences and evaluate aggregated website traffic performance.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">Managing Cookies</h3>
        <p>
          You can configure your browser to block or alert you about cookies. Basic browsing functionality on PULSE will remain fully operable without cookies.
        </p>
      </>
    ),
  },
  copyright: {
    title: 'Copyright & Content Policy',
    subtitle: 'Fair Use, Syndication & Content Attribution',
    icon: FileText,
    content: (
      <>
        <p>
          PULSE adheres strictly to ethical journalistic standards, copyright law, and fair use guidelines.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">Content Attribution</h3>
        <p>
          We never reproduce entire third-party articles. Our reporting references primary sources, public regulatory filings, official transcripts, and verified news wires with direct attribution and links.
        </p>
      </>
    ),
  },
  disclaimer: {
    title: 'Financial Disclaimer',
    subtitle: 'Not Financial, Investment, or Trading Advice',
    icon: AlertTriangle,
    content: (
      <>
        <DisclaimerBanner type="financial" className="mb-6" />
        <p>
          <strong>PULSE is not a registered investment advisor, broker-dealer, commodity trading advisor, or financial planning firm.</strong>
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">No Investment Advice</h3>
        <p>
          Nothing published on PULSE constitutes a recommendation to buy, sell, or hold any security, cryptocurrency, digital asset, derivative, commodity, or currency.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">Risk Warning</h3>
        <p>
          Financial markets involve substantial risk of capital loss. Past performance of any asset, index, or strategy is not indicative of future results. Always consult a licensed financial advisor before making investment decisions.
        </p>
      </>
    ),
  },
  'editorial-policy': {
    title: 'Editorial Policy',
    subtitle: 'Journalistic Independence & AI Synthesis Standards',
    icon: Info,
    content: (
      <>
        <p>
          PULSE maintains rigorous editorial standards to deliver accurate, unbiased, and verified financial intelligence.
        </p>
        <h3 className="text-lg font-bold text-slate-900 mt-6 font-sans">AI Usage Policy</h3>
        <p>
          AI models are used strictly as analytical tools to synthesize verified facts, summarize long documents, and isolate key risk vectors. AI models never invent facts, quotes, prices, or market events.
        </p>
      </>
    ),
  },
};

export const LegalPage: React.FC<LegalPageProps> = ({ pageType }) => {
  const data = PAGE_DATA[pageType] || PAGE_DATA.about;
  const { navigate } = useRouter();
  const Icon = data.icon;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 py-4">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-blue-600 transition-colors self-start cursor-pointer font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Wire</span>
      </button>

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            PULSE Documentation
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0f172a] mt-2">
          {data.title}
        </h1>

        <p className="text-slate-600 text-sm sm:text-base mt-2">
          {data.subtitle}
        </p>
      </div>

      {/* Content Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 shadow-xs">
        {data.content}
      </div>
    </div>
  );
};
