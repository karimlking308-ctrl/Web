import React, { useState } from 'react';
import {
  Code,
  Terminal,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  Layers,
  FileCode,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Bot,
  Flame,
  Info,
  X,
} from 'lucide-react';
import { DEVELOPER_SCRIPTS, DeveloperScript } from '../data/developerScripts';
import {
  generateBulkSenderScriptZIP,
  generateTelegramBroadcastScriptZIP,
  generateAIContentBatchScriptZIP,
  generateRustTxDispatcherScriptZIP,
} from '../utils/assetGenerators';

interface DeveloperScriptsVaultProps {
  onSelectPlan: (planId: string) => void;
  activeLicenseKey?: string | null;
}

type LanguageFilter = 'all' | 'python' | 'nodejs' | 'rust';

export const DeveloperScriptsVault: React.FC<DeveloperScriptsVaultProps> = ({
  onSelectPlan,
  activeLicenseKey,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageFilter>('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedCliId, setCopiedCliId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [activeModalScript, setActiveModalScript] = useState<DeveloperScript | null>(null);

  const filteredScripts = DEVELOPER_SCRIPTS.filter((script) => {
    if (selectedLanguage === 'all') return true;
    return script.language === selectedLanguage;
  });

  const handleCopyCode = (id: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyCLI = (id: string, cli: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cli);
    setCopiedCliId(id);
    setTimeout(() => setCopiedCliId(null), 2000);
  };

  const handleDownloadScript = async (script: DeveloperScript, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingId(script.id);
    setDownloadToast(null);

    try {
      if (script.id === 'script-solana-bulk-sender') {
        await generateBulkSenderScriptZIP(activeLicenseKey || 'SOLPUMP-SCRIPT-BULK-2026');
      } else if (script.id === 'script-telegram-broadcast-bot') {
        await generateTelegramBroadcastScriptZIP(activeLicenseKey || 'SOLPUMP-SCRIPT-TG-2026');
      } else if (script.id === 'script-ai-content-batch-generator') {
        await generateAIContentBatchScriptZIP(activeLicenseKey || 'SOLPUMP-SCRIPT-AI-2026');
      } else if (script.id === 'script-rust-tx-dispatcher') {
        await generateRustTxDispatcherScriptZIP(activeLicenseKey || 'SOLPUMP-SCRIPT-RUST-2026');
      }
      setDownloadToast(`Started downloading ${script.title} (.ZIP)`);
      setTimeout(() => setDownloadToast(null), 4000);
    } catch (err: any) {
      console.error('Failed to generate script ZIP:', err);
      setDownloadToast(`Download failed: ${err?.message || 'Error'}`);
      setTimeout(() => setDownloadToast(null), 4000);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const getLanguageBadgeColor = (lang: string) => {
    switch (lang) {
      case 'python':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'nodejs':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'rust':
        return 'bg-orange-500/10 text-orange-300 border-orange-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getLanguageIcon = (lang: string) => {
    switch (lang) {
      case 'python':
        return '🐍';
      case 'nodejs':
        return '🟩';
      case 'rust':
        return '🦀';
      default:
        return '⚡';
    }
  };

  return (
    <section
      id="developer-scripts"
      className="py-16 md:py-24 bg-[#080b12] border-b border-slate-800/80 relative overflow-hidden"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Automation Vault</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Ready-to-Deploy Developer Scripts
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Production-tested automation scripts, CLI utilities, and bot microservices in Python, Node.js, and Rust with commercial execution rights.
          </p>
        </div>

        {/* Feature & Quality Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">100% Tested Clean Code</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Async High-Throughput</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Interactive CLI Interfaces</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <Unlock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Commercial License Included</span>
          </div>
        </div>

        {/* Language Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Scripts', count: DEVELOPER_SCRIPTS.length, icon: '⚡' },
            { id: 'python', label: 'Python 3.11+', count: DEVELOPER_SCRIPTS.filter((s) => s.language === 'python').length, icon: '🐍' },
            { id: 'nodejs', label: 'Node.js (TypeScript)', count: DEVELOPER_SCRIPTS.filter((s) => s.language === 'nodejs').length, icon: '🟩' },
            { id: 'rust', label: 'Rust / Cargo', count: DEVELOPER_SCRIPTS.filter((s) => s.language === 'rust').length, icon: '🦀' },
          ].map((tab) => {
            const isSelected = selectedLanguage === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedLanguage(tab.id as LanguageFilter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono-code font-bold ${
                    isSelected ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {downloadToast && (
          <div className="max-w-xl mx-auto mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code flex items-center justify-center gap-2 animate-in fade-in duration-200 shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Script Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-12">
          {filteredScripts.map((script) => {
            const isCopied = copiedCodeId === script.id;
            const isCliCopied = copiedCliId === script.id;
            const isDownloading = downloadingId === script.id;

            return (
              <div
                key={script.id}
                className="rounded-2xl bg-[#0c101c] border border-slate-800/90 hover:border-slate-700/80 transition-all p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-black/40 group"
              >
                <div>
                  {/* Top Bar: Language Badge, Category & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-mono-code font-bold flex items-center gap-1.5 ${getLanguageBadgeColor(
                          script.language
                        )}`}
                      >
                        <span>{getLanguageIcon(script.language)}</span>
                        <span>{script.languageLabel}</span>
                      </span>
                      <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {script.version}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {script.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-1.5">
                    {script.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {script.description}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {script.techBadges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-800"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* CLI Quick Usage Box */}
                  <div className="mb-4 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/80 font-mono-code text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-300 truncate text-[11px]">$ {script.cliExample}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopyCLI(script.id, script.cliExample, e)}
                      title="Copy CLI command"
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      {isCliCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Interactive Code Snippet Preview Window */}
                  <div className="rounded-xl bg-[#07090f] border border-slate-800/90 overflow-hidden mb-5">
                    <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/70 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-mono-code text-slate-300 font-bold">
                          {script.codeFilename}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(script.id, script.previewCode, e)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-mono-code transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Snippet</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveModalScript(script)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-mono-code transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3 h-3" />
                          <span>Docs &amp; Guide</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 max-h-48 overflow-y-auto font-mono-code text-[11px] text-slate-300 leading-relaxed bg-[#05070c]">
                      <pre className="text-slate-300 overflow-x-auto whitespace-pre">
                        <code>{script.previewCode}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Highlight Features */}
                  <div className="space-y-1.5 mb-5">
                    {script.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] font-mono-code text-slate-400 flex items-center gap-2">
                    <span>Size: {script.fileSize}</span>
                    <span>•</span>
                    <span className="text-emerald-400">Full Source Included</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {activeLicenseKey ? (
                      <button
                        type="button"
                        onClick={(e) => handleDownloadScript(script, e)}
                        disabled={isDownloading}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50"
                      >
                        <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                        <span>{isDownloading ? 'Generating ZIP...' : 'Download Package (.ZIP)'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectPlan('lifetime')}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 group"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock Full Script Package</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Script Bundle Promotion Card */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1424] to-slate-900 border border-slate-700/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-black/50">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono-code font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>ALL SCRIPTS INCLUDED IN LIFETIME PASS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Get all Python, Node.js &amp; Rust scripts + full 9 digital products forever
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Lifetime Elite includes instant download of all developer scripts, Telegram bots, n8n automations, React boilerplates, and private repository updates for just $49 one-time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectPlan('lifetime')}
            className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#080b12] text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 shrink-0"
          >
            <span>Get Lifetime Script Access ($49)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Script Detailed Documentation & Setup Guide Modal */}
      {activeModalScript && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModalScript(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] bg-[#0c101c] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg">
                  {getLanguageIcon(activeModalScript.language)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{activeModalScript.title}</h3>
                  <p className="text-xs font-mono-code text-slate-400">
                    {activeModalScript.languageLabel} • {activeModalScript.version}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalScript(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Script Description &amp; Architecture
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeModalScript.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CLI Command Syntax:</span>
                </h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-xs text-emerald-300">
                  $ {activeModalScript.cliExample}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Key Features &amp; Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalScript.features.map((feat, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Step-by-Step Installation &amp; Setup Guide
                </h4>
                <div className="space-y-2">
                  {activeModalScript.setupGuide.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono-code shrink-0 font-bold">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono-code text-slate-400">
                Package: {activeModalScript.fileSize}
              </span>

              {activeLicenseKey ? (
                <button
                  type="button"
                  onClick={(e) => {
                    handleDownloadScript(activeModalScript, e);
                    setActiveModalScript(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .ZIP</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalScript(null);
                    onSelectPlan('lifetime');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Full Script Package ($49)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
