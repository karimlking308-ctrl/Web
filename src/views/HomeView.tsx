import React, { useMemo, useState } from 'react';
import { TOOLS, ToolDefinition } from '../config/tools';
import { ToolSearch } from '../components/ToolSearch';

interface HomeViewProps {
  onSelectTool: (toolId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.acceptedFormats.some((fmt) => fmt.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleLaunchTool = (tool: ToolDefinition) => {
    if (tool.externalUrl) {
      window.location.href = tool.externalUrl;
      return;
    }
    onSelectTool(tool.id);
  };

  const handleStartNow = () => {
    if (searchQuery.trim() && filteredTools.length > 0) {
      handleLaunchTool(filteredTools[0]);
      return;
    }
    const input = document.getElementById('tindry-home-search');
    if (input) {
      input.focus();
    }
  };

  const popularLinks: Array<{ id: string; label: string; href: string }> = [
    { id: 'jpg-to-pdf', label: 'JPG to PDF', href: '/jpg-to-pdf' },
    { id: 'merge-pdf', label: 'Merge PDF', href: '/merge-pdf' },
    { id: 'mp4-to-mp3', label: 'MP4 to MP3', href: '/mp4-to-mp3' },
  ];

  return (
    <div className="tindry-home-empty w-full flex flex-col items-center justify-center text-center bg-white">
      <div className="tindry-home-hero w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Hero Title */}
        <h1 className="tindry-hero-title">
          Simple file tools{' '}
          <span className="tindry-hero-title-accent">that just work.</span>
        </h1>

        {/* Subtitle */}
        <p className="tindry-hero-subtitle">
          No sign-up. No watermark. Fast, private &amp; free.
        </p>

        {/* Centered Search Bar */}
        <div className="tindry-search-container relative w-full">
          <ToolSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleStartNow}
          />

          {searchQuery.trim() !== '' && (
            <div className="tindry-search-results">
              {filteredTools.length === 0 ? (
                <div className="px-4 py-3 text-xs text-[#0F0F0F]">
                  No tools matching &quot;{searchQuery}&quot;.
                </div>
              ) : (
                filteredTools.map((tool) => (
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

        {/* 1 Gold Button */}
        <button
          type="button"
          onClick={handleStartNow}
          className="tindry-start-btn"
        >
          Start Now
        </button>

        {/* Popular Text Links Row */}
        <div className="tindry-popular-row">
          <span className="tindry-popular-label">Popular:</span>
          <div className="tindry-popular-links">
            {popularLinks.map((item, idx) => (
              <React.Fragment key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTool(item.id);
                  }}
                  className="tindry-popular-link"
                >
                  {item.label}
                </a>
                {idx < popularLinks.length - 1 && (
                  <span className="tindry-popular-sep" aria-hidden="true">
                    &middot;
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
