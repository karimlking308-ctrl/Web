import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ToolDefinition } from '../config/tools';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (toolId: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const Icon = tool.icon;

  return (
    <a
      href={`/tools/${tool.id}`}
      onClick={(e) => {
        e.preventDefault();
        onSelect(tool.id);
      }}
      className="group relative bg-white border border-neutral-200 rounded-xl p-6 hover:border-black transition-colors cursor-pointer flex flex-col justify-between no-underline block"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded border border-neutral-200 flex items-center justify-center text-black group-hover:border-black transition-colors">
            <Icon className="w-5 h-5 text-black" strokeWidth={1.75} />
          </div>
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            {tool.badge}
          </span>
        </div>

        <h3 className="text-sm font-bold text-black mb-1.5 group-hover:underline">
          {tool.name}
        </h3>

        <p className="text-xs text-neutral-500 leading-relaxed mb-6">
          {tool.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs font-semibold text-black">
        <span>Use tool</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
};
