import React, { useMemo, useState } from 'react';
import {
  Files,
  FileImage,
  Music,
  Sparkles,
  Minimize2,
  QrCode,
  ShieldCheck,
  Zap,
  Award,
  Lock,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  Video,
  Image as ImageIcon,
  Smartphone,
  Scaling,
  RefreshCw,
  Crop,
  Palette,
  FileText,
  Scissors,
} from 'lucide-react';
import { TOOLS, ToolDefinition } from '../config/tools';
import { ToolSearch } from '../components/ToolSearch';

interface HomeViewProps {
  onSelectTool: (toolId: string) => void;
}

type CategoryFilter = 'all' | 'pdf' | 'image' | 'video';

interface LuxuryCardItem {
  id: string;
  name: string;
  description: string;
  href: string;
  category: Exclude<CategoryFilter, 'all'>;
  externalUrl?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const POPULAR_CARDS: LuxuryCardItem[] = [
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images into a crisp PDF document.',
    href: '/jpg-to-pdf',
    category: 'pdf',
    icon: FileImage,
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one seamless file.',
    href: '/merge-pdf',
    category: 'pdf',
    icon: Files,
  },
  {
    id: 'mp4-to-mp3',
    name: 'MP4 to MP3',
    description: 'Extract studio-clean MP3 audio from MP4 video.',
    href: '/mp4-to-mp3',
    category: 'video',
    icon: Music,
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    description: 'Remove photo backgrounds to transparent PNG.',
    href: '/background-remover.html',
    externalUrl: '/background-remover.html',
    category: 'image',
    icon: Sparkles,
  },
  {
    id: 'compress-image',
    name: 'Compress Image',
    description: 'Shrink image file sizes while keeping sharp detail.',
    href: '/compress-image',
    category: 'image',
    icon: Minimize2,
  },
  {
    id: 'qr-generator',
    name: 'QR Code',
    description: 'Create high-resolution custom QR codes offline.',
    href: '/qr-generator.html',
    externalUrl: '/qr-generator.html',
    category: 'image',
    icon: QrCode,
  },
];

const EXTRA_CATEGORY_CARDS: LuxuryCardItem[] = [
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Extract PDF pages into high-resolution JPG images.',
    href: '/pdf-to-jpg',
    category: 'pdf',
    icon: ImageIcon,
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF documents into editable Word files.',
    href: '/pdf-to-word.html',
    externalUrl: '/pdf-to-word.html',
    category: 'pdf',
    icon: FileText,
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages from your PDF.',
    href: '/split-pdf.html',
    externalUrl: '/split-pdf.html',
    category: 'pdf',
    icon: Scissors,
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF size without losing quality.',
    href: '/compress-pdf.html',
    externalUrl: '/compress-pdf.html',
    category: 'pdf',
    icon: Minimize2,
  },
  {
    id: 'heic-to-jpg',
    name: 'HEIC to JPG',
    description: 'Convert iPhone HEIC photos to universal JPG.',
    href: '/heic-to-jpg.html',
    externalUrl: '/heic-to-jpg.html',
    category: 'image',
    icon: Smartphone,
  },
  {
    id: 'image-upscaler',
    name: 'Image Upscaler',
    description: 'Enhance image resolution up to 4x HD in-browser.',
    href: '/image-upscaler.html',
    externalUrl: '/image-upscaler.html',
    category: 'image',
    icon: Scaling,
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    description: 'Convert transparent PNGs to JPG with clean fill.',
    href: '/png-to-jpg.html',
    externalUrl: '/png-to-jpg.html',
    category: 'image',
    icon: FileImage,
  },
  {
    id: 'webp-to-jpg',
    name: 'WEBP to JPG',
    description: 'Convert modern WEBP files into standard JPGs.',
    href: '/webp-to-jpg.html',
    externalUrl: '/webp-to-jpg.html',
    category: 'image',
    icon: RefreshCw,
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize photos precisely for social platforms.',
    href: '/image-resizer.html',
    externalUrl: '/image-resizer.html',
    category: 'image',
    icon: Crop,
  },
  {
    id: 'color-palette',
    name: 'Color Palette',
    description: 'Extract 5 signature hex colors from any image.',
    href: '/color-palette.html',
    externalUrl: '/color-palette.html',
    category: 'image',
    icon: Palette,
  },
  {
    id: 'webm-to-mp4',
    name: 'WebM to MP4',
    description: 'Convert browser WebM captures to universal MP4.',
    href: '/webm-to-mp4',
    category: 'video',
    icon: Video,
  },
];

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredSearchTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.acceptedFormats.some((fmt) => fmt.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const displayedCards = useMemo(() => {
    if (activeCategory === 'all') {
      return POPULAR_CARDS;
    }
    const combined = [...POPULAR_CARDS, ...EXTRA_CATEGORY_CARDS];
    return combined.filter((card) => card.category === activeCategory);
  }, [activeCategory]);

  const handleLaunchTool = (tool: ToolDefinition) => {
    if (tool.externalUrl) {
      window.location.href = tool.externalUrl;
      return;
    }
    onSelectTool(tool.id);
  };

  const handleCardClick = (e: React.MouseEvent, card: LuxuryCardItem) => {
    if (card.externalUrl) {
      return;
    }
    e.preventDefault();
    onSelectTool(card.id);
  };

  const handleStartNow = () => {
    if (searchQuery.trim() && filteredSearchTools.length > 0) {
      handleLaunchTool(filteredSearchTools[0]);
      return;
    }
    const toolsSection = document.getElementById('popular-tools');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categoryPills: Array<{ id: CategoryFilter; label: string }> = [
    { id: 'all', label: 'All Tools' },
    { id: 'pdf', label: 'PDF' },
    { id: 'image', label: 'Image' },
    { id: 'video', label: 'Video' },
  ];

  const trustItems = [
    { icon: Lock, label: '100% Browser Private' },
    { icon: UploadCloud, label: 'Zero Cloud Uploads' },
    { icon: Zap, label: 'Instant Local Speed' },
    { icon: CheckCircle2, label: 'Free Forever' },
  ];

  const whyItems = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'Instant client-side processing directly inside your browser with zero upload queues.',
    },
    {
      icon: ShieldCheck,
      title: '100% Secure & Private',
      description:
        'Sensitive documents, photos, and media never leave your device or touch external servers.',
    },
    {
      icon: Award,
      title: 'No Watermark',
      description:
        'Pristine, full-quality downloads with zero watermarks, hidden limits, or account walls.',
    },
  ];

  return (
    <div className="tindry-home-luxury w-full">
      {/* 1. LUXURY HERO SECTION */}
      <section className="tindry-luxury-hero relative w-full overflow-hidden">
        <div className="tindry-luxury-container relative z-10 flex flex-col items-center text-center">
          <h1 className="tindry-hero-title">
            <span className="tindry-hero-line-dark">Simple file tools</span>
            <span className="tindry-hero-line-gold">that just work.</span>
          </h1>

          <p className="tindry-hero-subtitle">
            No sign-up. No watermark. Fast, private &amp; free.
          </p>

          {/* Luxury Search Bar */}
          <div className="tindry-search-container relative w-full">
            <ToolSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleStartNow}
            />

            {searchQuery.trim() !== '' && (
              <div className="tindry-search-results">
                {filteredSearchTools.length === 0 ? (
                  <div className="px-5 py-3.5 text-xs text-[#0F0F0F]">
                    No tools matching &quot;{searchQuery}&quot;.
                  </div>
                ) : (
                  filteredSearchTools.map((tool) => (
                    <a
                      key={tool.id}
                      href={tool.externalUrl || `/${tool.id}`}
                      onClick={(e) => {
                        if (tool.externalUrl) return;
                        e.preventDefault();
                        handleLaunchTool(tool);
                      }}
                      className="tindry-search-result-item"
                    >
                      <span>{tool.name}</span>
                      <span className="tindry-search-result-badge">{tool.badge}</span>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Gold Metallic CTA */}
          <button
            type="button"
            onClick={handleStartNow}
            className="tindry-start-btn"
          >
            Start Now
          </button>

          {/* Trust Row (4 small items, gold icons, no big boxes) */}
          <div className="tindry-trust-row">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="tindry-trust-item">
                  <Icon className="w-4 h-4 text-[#D4AF37] flex-shrink-0" strokeWidth={1.6} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. POPULAR TOOLS SECTION (PURE WHITE #FFFFFF) */}
      <section id="popular-tools" className="tindry-luxury-popular w-full bg-white">
        <div className="tindry-luxury-container">
          <div className="tindry-section-header">
            <h2 className="tindry-section-heading">Popular Tools</h2>
            <div className="tindry-category-pills" role="tablist" aria-label="Filter tools by category">
              {categoryPills.map((pill) => {
                const isActive = activeCategory === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(pill.id)}
                    className={`tindry-category-pill ${
                      isActive ? 'tindry-category-pill-active' : 'tindry-category-pill-inactive'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="tindry-luxury-cards-grid">
            {displayedCards.map((card) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.id}
                  href={card.href}
                  onClick={(e) => handleCardClick(e, card)}
                  className="tindry-luxury-card group"
                >
                  <div className="tindry-luxury-card-top">
                    <div className="tindry-luxury-card-icon">
                      <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                    </div>
                    <ArrowRight
                      className="w-4 h-4 text-[#D4AF37] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="tindry-luxury-card-title">{card.name}</h3>
                  <p className="tindry-luxury-card-desc">{card.description}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. WHY TINDRY SECTION (IVORY #F9F6EF WITH GOLD DIAMOND DIVIDER) */}
      <section className="tindry-luxury-why w-full">
        <div className="tindry-luxury-container">
          <div className="tindry-gold-divider" aria-hidden="true">
            <span className="tindry-gold-divider-line" />
            <span className="tindry-gold-divider-diamond" />
            <span className="tindry-gold-divider-line" />
          </div>

          <div className="tindry-why-header">
            <h2 className="tindry-section-heading">Why Tindry</h2>
          </div>

          <div className="tindry-why-grid">
            {whyItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="tindry-why-item">
                  <div className="tindry-why-icon">
                    <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <h3 className="tindry-why-title">{item.title}</h3>
                  <p className="tindry-why-desc">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
