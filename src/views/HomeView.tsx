import React, { useMemo, useState } from 'react';
import { TOOLS } from '../config/tools';
import { ToolCard } from '../components/ToolCard';
import { ToolSearch } from '../components/ToolSearch';
import { FileConversionDemo } from '../components/FileConversionDemo';

interface HomeViewProps {
  onSelectTool: (toolId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS;
    const q = searchQuery.toLowerCase().trim();
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.acceptedFormats.some((fmt) => fmt.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="space-y-12 sm:space-y-16 max-w-4xl mx-auto py-2 sm:py-6">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black leading-tight">
            Simple file tools that just work.
          </h1>

          <p className="text-sm text-neutral-600 leading-relaxed max-w-lg">
            Convert, merge and compress your files quickly and securely.
          </p>

          <div className="pt-2 max-w-sm">
            <ToolSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* Subtle Black-and-White File Conversion Demo */}
        <div className="lg:col-span-5">
          <FileConversionDemo />
        </div>
      </div>

      {/* Allowed 5 Tools Section */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black">
            {searchQuery ? `Matching Tools (${filteredTools.length})` : 'Tools'}
          </h2>
          <span className="text-[11px] font-mono text-neutral-400">
            5 Tools
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="py-12 border border-neutral-200 rounded-xl text-center p-6 bg-white">
            <p className="text-xs text-neutral-500">
              No tool found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs text-black font-semibold underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
            ))}
          </div>
        )}
      </div>

      {/* Feature Footnote */}
      <div className="pt-8 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-500">
        <div>
          <strong className="text-black block mb-0.5">Direct in Browser</strong>
          Files are processed locally via client-side engines.
        </div>
        <div>
          <strong className="text-black block mb-0.5">Complete Privacy</strong>
          Your confidential files are never uploaded to any remote server.
        </div>
        <div>
          <strong className="text-black block mb-0.5">Real Outputs</strong>
          Genuine downloadable files verified and ready to use.
        </div>
      </div>
    </div>
  );
};
