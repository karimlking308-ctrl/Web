import React from 'react';
import { 
  Home, 
  Layers, 
  BookOpen,
  Music, 
  Video, 
  Files, 
  FileImage, 
  Image as ImageIcon, 
  Minimize2, 
  HelpCircle, 
  X,
  Sparkles,
  Smartphone,
  Scaling,
  RefreshCw,
  Crop,
  QrCode,
  Palette,
  FileText,
  Scissors
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
    { id: 'mp4-to-mp3', label: 'MP4 to MP3', icon: Music, href: '/mp4-to-mp3' },
    { id: 'webm-to-mp4', label: 'WebM to MP4', icon: Video, href: '/webm-to-mp4' },
    { id: 'merge-pdf', label: 'Merge PDF', icon: Files, href: '/merge-pdf' },
    { id: 'jpg-to-pdf', label: 'JPG to PDF', icon: FileImage, href: '/jpg-to-pdf' },
    { id: 'pdf-to-jpg', label: 'PDF to JPG', icon: ImageIcon, href: '/pdf-to-jpg' },
    { id: 'compress-image', label: 'Compress Image', icon: Minimize2, href: '/compress-image' },
    { id: 'background-remover', label: 'Background Remover', icon: Sparkles, href: '/background-remover' },
    { id: 'heic-to-jpg', label: 'HEIC to JPG Converter', icon: Smartphone, href: '/heic-to-jpg' },
    { id: 'image-upscaler', label: 'Image Upscaler 4x HD', icon: Scaling, href: '/image-upscaler' },
    { id: 'png-to-jpg', label: 'PNG to JPG Converter', icon: FileImage, href: '/png-to-jpg' },
    { id: 'webp-to-jpg', label: 'WEBP to JPG Converter', icon: RefreshCw, href: '/webp-to-jpg' },
    { id: 'image-resizer', label: 'Image Resizer for Social Media', icon: Crop, href: '/image-resizer' },
    { id: 'qr-generator', label: 'QR Code Generator', icon: QrCode, href: '/qr-generator' },
    { id: 'color-palette', label: 'Color Palette Extractor', icon: Palette, href: '/color-palette' },
    { id: 'word-counter', label: 'Word Counter & Case Converter', icon: FileText, href: '/word-counter' },
    { id: 'pdf-to-word', label: 'PDF to Word - Private', icon: FileText, href: '/pdf-to-word.html' },
    { id: 'split-pdf', label: 'Split PDF', icon: Scissors, href: '/split-pdf.html', description: 'Extract pages from your PDF.' },
    { id: 'compress-pdf', label: 'Compress PDF', icon: Minimize2, href: '/compress-pdf.html', description: 'Reduce PDF size without losing quality.' },
  ];

  const handleItemClick = (id: string, href?: string) => {
    if (href && !['mp4-to-mp3', 'webm-to-mp4', 'merge-pdf', 'jpg-to-pdf', 'pdf-to-jpg', 'compress-image'].includes(id)) {
      window.location.href = href;
      return;
    }
    onNavigate(id);
    onClose();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#0F0F0F] text-white border-r border-[#1A1A1A] select-none">
      {/* Brand header */}
      <div className="px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between border-b border-[#1A1A1A]">
        <a 
          href="/"
          onClick={(e) => { e.preventDefault(); onNavigate('home'); onClose(); }}
          className="cursor-pointer inline-flex items-center gap-1.5 min-h-[44px]"
        >
          <span className="font-bold text-base sm:text-lg tracking-tight text-[#D4AF37]">
            Tindry
          </span>
        </a>

        {/* Tablet & Mobile close button (< 1024px) */}
        <button
          onClick={onClose}
          className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center -mr-2 text-[#D4AF37] hover:bg-[#1A1A1A] rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-[#D4AF37]" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 sm:px-4 space-y-5 overflow-y-auto">
        <div className="space-y-1">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); handleItemClick('home'); }}
            className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'home'
                ? 'bg-black text-[#D4AF37]'
                : 'text-white hover:text-[#E8C468] hover:bg-[#1A1A1A]'
            }`}
          >
            <Home className="w-4 h-4 flex-shrink-0 text-[#D4AF37]" />
            <span>Home</span>
          </a>

          <a
            href="/"
            onClick={(e) => { e.preventDefault(); handleItemClick('all-tools'); }}
            className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'all-tools'
                ? 'bg-black text-[#D4AF37]'
                : 'text-white hover:text-[#E8C468] hover:bg-[#1A1A1A]'
            }`}
          >
            <Layers className="w-4 h-4 flex-shrink-0 text-[#D4AF37]" />
            <span>All Tools</span>
          </a>

          <a
            href="/blog"
            onClick={(e) => { e.preventDefault(); handleItemClick('blog'); }}
            className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              currentView.startsWith('blog')
                ? 'bg-black text-[#D4AF37]'
                : 'text-white hover:text-[#E8C468] hover:bg-[#1A1A1A]'
            }`}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0 text-[#D4AF37]" />
            <span>Blog</span>
          </a>

          <a
            href="/faq"
            onClick={(e) => { e.preventDefault(); handleItemClick('faq'); }}
            className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'faq'
                ? 'bg-black text-[#D4AF37]'
                : 'text-white hover:text-[#E8C468] hover:bg-[#1A1A1A]'
            }`}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0 text-[#D4AF37]" />
            <span>FAQ</span>
          </a>
        </div>

        <div className="border-t border-[#1A1A1A] pt-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
            File Tools
          </div>

          {tools.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <a
                key={item.id}
                href={item.href || `/${item.id}`}
                title={'description' in item ? item.description : undefined}
                onClick={(e) => { e.preventDefault(); handleItemClick(item.id, item.href); }}
                className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-black text-[#D4AF37]'
                    : 'text-white hover:text-[#E8C468] hover:bg-[#1A1A1A]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-[#D4AF37]" />
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}

          {/* PRIVATE PACK - BOTTOM OF SIDEBAR */}
          <div style={{ margin: '24px 12px 12px 12px', padding: '16px', background: '#1A1A1A', border: '1px solid #D4AF37', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '13px', color: '#D4AF37', marginBottom: '4px' }}>✨ PRIVATE PACK</div>
            <div style={{ fontSize: '11px', color: '#FFFFFF', marginBottom: '10px' }}>Premium Reference</div>
            <a href="https://tindry.gumroad.com/l/Private" className="min-h-[44px] flex items-center justify-center" style={{ background: '#D4AF37', color: '#000000', padding: '10px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 900, fontSize: '13px' }}>
              👑 $5 - Get Now
            </a>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="p-4 sm:p-5 border-t border-[#1A1A1A] text-[11px] text-[#F9F6EF]">
        <p>Private &middot; Client-Side</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (1024px+) */}
      <aside className="hidden lg:block w-60 h-screen sticky top-0 flex-shrink-0 z-30">
        {content}
      </aside>

      {/* Tablet & Mobile Drawer with Backdrop (< 1024px) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="tindry-drawer-panel relative w-72 max-w-[85vw] h-full shadow-2xl bg-[#0F0F0F] z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
