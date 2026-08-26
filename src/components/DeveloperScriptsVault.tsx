import React, { useState } from 'react';
import {
  Code,
  Terminal,
  Download,
  Copy,
  Check,
  Sparkles,
  Zap,
  FileCode,
  CheckCircle2,
  Info,
  X,
  Send,
} from 'lucide-react';
import { DEVELOPER_SCRIPTS, DeveloperScript } from '../data/developerScripts';
import { triggerMonetagDirectLink } from '../utils/monetag';
import {
  generateBulkSenderScriptZIP,
  generateTelegramBroadcastScriptZIP,
  generateAIContentBatchScriptZIP,
  generateRustTxDispatcherScriptZIP,
} from '../utils/assetGenerators';

interface DeveloperScriptsVaultProps {
  onSelectPlan?: (planId: string) => void;
  activeLicenseKey?: string | null;
}

type LanguageFilter = 'all' | 'python' | 'nodejs' | 'rust';

export const DeveloperScriptsVault: React.FC<DeveloperScriptsVaultProps> = () => {
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
    triggerMonetagDirectLink();
    setDownloadingId(script.id);
    setDownloadToast(null);

    try {
      if (script.id === 'script-solana-bulk-sender') {
        await generateBulkSenderScriptZIP('SOLPUMP-FREE-OPEN-ACCESS');
      } else if (script.id === 'script-telegram-broadcast-bot') {
        await generateTelegramBroadcastScriptZIP('SOLPUMP-FREE-OPEN-ACCESS');
      } else if (script.id === 'script-ai-content-batch-generator') {
        await generateAIContentBatchScriptZIP('SOLPUMP-FREE-OPEN-ACCESS');
      } else if (script.id === 'script-rust-tx-dispatcher') {
        await generateRustTxDispatcherScriptZIP('SOLPUMP-FREE-OPEN-ACCESS');
      } else {
        await generateBulkSenderScriptZIP('SOLPUMP-FREE-OPEN-ACCESS');
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
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    }
  };

  const getLanguageIcon = (lang: string) => {
    switch (lang) {
      case 'python':
        return '🐍';
      case 'nodejs':
        return '🟢';
      case 'rust':
        return '🦀';
      default:
        return '⚡';
    }
  };

  return (
    <section id="developer-scripts" className="py-20 md:py-28 bg-[#050811] border-t border-slate-800/80 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[300px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[300px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Source Developer Scripts Vault</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Ready-To-Run Developer Scripts
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            100% free open access to executable Python, Node.js, and Rust scripts. Copy code snippets, view CLI documentation, or download full source code packages with 1-click.
          </p>
        </div>

        {/* Language Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Executables', icon: Code, count: DEVELOPER_SCRIPTS.length },
            { id: 'python', label: 'Python Scripts', icon: Terminal, count: 1 },
            { id: 'nodejs', label: 'Node.js Engines', icon: Zap, count: 2 },
            { id: 'rust', label: 'Rust Dispatchers', icon: Sparkles, count: 1 },
          ].map((tab) => {
            const isActive = selectedLanguage === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedLanguage(tab.id as LanguageFilter)}
                className={`px-4 py-2 rounded-2xl text-xs font-medium font-mono-code transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Toast Banner */}
        {downloadToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono-code flex items-center gap-2 shadow-xl animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Script Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filteredScripts.map((script) => {
            const isCopied = copiedCodeId === script.id;
            const isCliCopied = copiedCliId === script.id;
            const isDownloading = downloadingId === script.id;

            return (
              <div
                key={script.id}
                className="rounded-3xl p-6 sm:p-7 bg-[#0a0e19] border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Header info */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getLanguageIcon(script.language)}</span>
                      <span
                        className={`text-[10px] font-mono-code font-bold uppercase px-2.5 py-0.5 rounded-full border ${getLanguageBadgeColor(
                          script.language
                        )}`}
                      >
                        {script.languageLabel}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      100% FREE ACCESS
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-1">{script.title}</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{script.description}</p>

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
                          <Info className="w-3 h-3 text-amber-400" />
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

                {/* Bottom Action Footer - 1-Click Direct Download */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] font-mono-code text-slate-400 flex items-center gap-2">
                    <span>Size: {script.fileSize}</span>
                    <span>•</span>
                    <span className="text-emerald-400">Full Source Included</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDownloadScript(script, e)}
                    disabled={isDownloading}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50"
                  >
                    <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-spin' : ''}`} />
                    <span>{isDownloading ? 'Generating ZIP...' : 'Download Package (.ZIP)'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Community Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1424] to-slate-900 border border-slate-700/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-black/50">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono-code font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% OPEN SOURCE &amp; FREE FOR COMMUNITY</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Need custom script modifications or new n8n AI agent workflows?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Join our Telegram community to request custom code, report issues, or get direct help from active Web3 &amp; AI developers.
            </p>
          </div>

          <a
            href="https://t.me/solpump_store"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080b12] text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25 shrink-0"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>Join Developer Telegram Chat</span>
          </a>
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
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
