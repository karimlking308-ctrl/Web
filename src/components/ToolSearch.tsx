import React from 'react';
import { Search, X } from 'lucide-react';

interface ToolSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const ToolSearch: React.FC<ToolSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
        <Search className="w-3.5 h-3.5 text-neutral-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tools..."
        className="w-full pl-9 pr-8 py-2 bg-white border border-neutral-200 rounded-md text-xs placeholder:text-neutral-400 text-black focus:outline-none focus:border-black transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-black"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
