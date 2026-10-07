import React from 'react';
import { 
  Home, 
  Layers, 
  Music, 
  Files, 
  FileImage, 
  Image as ImageIcon, 
  Minimize2, 
  HelpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const tools = [
    { id: 'mp4-to-mp3', label: 'MP4 to MP3', icon: Music },
    { id: 'merge-pdf', label: 'Merge PDF', icon: Files },
    { id: 'jpg-to-pdf', label: 'JPG to PDF', icon: FileImage },
    { id: 'pdf-to-jpg', label: 'PDF to JPG', icon: ImageIcon },
    { id: 'compress-image', label: 'Compress Image', icon: Minimize2 },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200 select-none">
      {/* Brand header */}
      <div className="px-5 py-5 sm:px-6 sm:py-6 flex items-center justify-between border-b border-neutral-200">
        <a 
          href="/"
          onClick={(e) => { e.preventDefault(); onNavigate('home'); onClose(); }}
          className="cursor-pointer"
        >
          <span className="font-bold text-base sm:text-lg tracking-tight text-black">
            Tindry
          </span>
        </a>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="md:hidden p-2 -mr-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 sm:px-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); handleItemClick('home'); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'home'
                ? 'bg-black text-white'
                : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            <span>Home</span>
          </a>

          <a
            href="/tools"
            onClick={(e) => { e.preventDefault(); handleItemClick('all-tools'); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'all-tools'
                ? 'bg-black text-white'
                : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span>All Tools</span>
          </a>

          <a
            href="/faq"
            onClick={(e) => { e.preventDefault(); handleItemClick('faq'); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'faq'
                ? 'bg-black text-white'
                : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
            }`}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span>FAQ</span>
          </a>
        </div>

        <div className="border-t border-neutral-200 pt-5 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            File Tools
          </div>

          {tools.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <a
                key={item.id}
                href={`/tools/${item.id}`}
                onClick={(e) => { e.preventDefault(); handleItemClick(item.id); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-current" />
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="p-4 sm:p-5 border-t border-neutral-200 text-[11px] text-neutral-400">
        <p>Private &middot; Client-Side</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-56 lg:w-60 h-screen sticky top-0 flex-shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer with Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[82vw] h-full shadow-2xl bg-white">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
