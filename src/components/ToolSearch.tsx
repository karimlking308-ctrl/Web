import React from 'react';
import { Search, X } from 'lucide-react';

interface ToolSearchProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
}

export const ToolSearch: React.FC<ToolSearchProps> = ({ value, onChange, onSubmit }) => {
  return (
    <div className="tindry-search-wrap relative w-full mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D4AF37]">
        <Search className="w-5 h-5 text-[#D4AF37]" />
      </div>
      <input
        id="tindry-home-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Search tools"
        className="tindry-search-input w-full min-h-[52px] pl-12 pr-12 py-3.5 bg-white border border-[#D4AF37] rounded-xl text-sm sm:text-base placeholder:text-[#0F0F0F]/50 text-[#0F0F0F] focus:outline-none focus:border-[#D4AF37] transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 min-w-[44px] min-h-[44px] px-3 flex items-center justify-center text-[#0F0F0F] hover:text-[#D4AF37]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
