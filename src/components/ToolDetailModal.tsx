import React, { useState } from 'react';
import { X, Check, Copy, Terminal, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { ToolItem } from '../data/toolsData';

interface ToolDetailModalProps {
  tool: ToolItem | null;
  onClose: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({ tool, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!tool) return null;

  const isAi = tool.category === 'ai';
  const isDev = tool.category === 'dev';
  const isWeb3 = tool.category === 'web3';

  const sampleSnippet = isAi
    ? `// SolPump AI Prompt Vault: ${tool.title}
// Model target: LLM / Multimodal Agent
SYSTEM_INSTRUCTION = """
You are an expert system orchestrator specialized in ${tool.tags.join(', ')}.
Execute rigorous validation with zero hallucination parameters.
"""`
    : isDev
    ? `// SolPump Dev Utility: ${tool.title}
import { sanitizePayload } from '@solpump/utils';

const cleanPayload = sanitizePayload(rawInput, {
  redactSecrets: true,
  strictSchema: true
});`
    : `// SolPump Web3 Decoder: ${tool.title}
import { Connection, PublicKey } from '@solana/web3.js';
import { decodeSolpumpTx } from '@solpump/solana';

const inspected = await decodeSolpumpTx(txSignature);`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c101d] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Category Header */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-mono-code font-semibold px-2.5 py-1 rounded-full ${
              isAi
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : isDev
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
            }`}
          >
            {tool.categoryLabel}
          </span>
          <span className="text-xs font-mono-code text-slate-400">{tool.version}</span>
          <span className="text-xs font-mono-code text-emerald-400 ml-auto mr-8">
            {tool.pricing}
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl font-bold text-white mb-2">{tool.title}</h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">{tool.description}</p>

        {/* Feature List */}
        <div className="mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-mono-code uppercase text-slate-400 font-semibold mb-3">
            Core Specifications &amp; Capabilities
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {tool.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code / Prompt Snippet Box */}
        <div className="mb-6 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono-code text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Runtime Blueprint
            </span>
            <button
              onClick={copyCode}
              className="flex items-center gap-1 text-xs font-mono-code text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono-code text-slate-300 overflow-x-auto leading-relaxed">
            {sampleSnippet}
          </pre>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tool.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-mono-code px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-code">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified by SolPump Engineering</span>
          </div>

          <button
            onClick={() => {
              copyCode();
            }}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            {copied ? 'Blueprint Copied!' : 'Copy & Deploy'}
          </button>
        </div>
      </div>
    </div>
  );
};
