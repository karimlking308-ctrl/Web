import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Save, 
  Upload, 
  Palette, 
  Type, 
  Layout, 
  ShoppingBag, 
  Plus, 
  Check, 
  Trash2, 
  Sparkles,
  ArrowLeft,
  Search,
  Sliders,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface StoreBuilderProps {
  onClose: () => void;
}

export const StoreBuilder: React.FC<StoreBuilderProps> = ({ onClose }) => {
  const { products, store } = useCommerce();
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'sections' | 'theme' | 'pages'>('sections');
  
  // Customization state
  const [storeHeading, setStoreHeading] = useState('Summer Collection');
  const [storeSubheading, setStoreSubheading] = useState('New Arrivals 2026');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [fontFamily, setFontFamily] = useState('Plus Jakarta Sans');
  const [savedBanner, setSavedBanner] = useState(false);
  const [sections, setSections] = useState([
    { id: 'announcement', title: 'Announcement Bar', enabled: true },
    { id: 'hero', title: 'Hero Banner', enabled: true },
    { id: 'featured_products', title: 'Featured Products', enabled: true },
    { id: 'categories', title: 'Category Carousel', enabled: true },
    { id: 'newsletter', title: 'Newsletter Signup', enabled: true },
    { id: 'footer', title: 'Footer & Socials', enabled: true }
  ]);

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Top Builder Bar */}
      <header className="h-16 bg-[#0f1422] border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{store?.name || 'Sol Pump Store'}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Live Theme
            </span>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              deviceView === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              deviceView === 'tablet' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              deviceView === 'mobile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {savedBanner && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Changes Published!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save & Publish
          </button>
        </div>
      </header>

      {/* Main Builder Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Settings Sidebar */}
        <div className="w-80 bg-[#0f1422] border-r border-slate-800 flex flex-col shrink-0">
          {/* Sub-tabs */}
          <div className="grid grid-cols-2 p-2 bg-slate-900/60 border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('sections')}
              className={`py-2 rounded-lg text-center transition cursor-pointer ${
                activeTab === 'sections' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sections
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-2 rounded-lg text-center transition cursor-pointer ${
                activeTab === 'theme' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Theme Settings
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
            {activeTab === 'sections' && (
              <div className="space-y-4">
                <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">Homepage Sections</div>
                {sections.map((section) => (
                  <div key={section.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-white">{section.title}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => toggleSection(section.id)}
                      className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
                    />
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-800">
                  <label className="block font-bold text-white mb-2">Hero Headline</label>
                  <input
                    type="text"
                    value={storeHeading}
                    onChange={(e) => setStoreHeading(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 mb-3"
                  />

                  <label className="block font-bold text-white mb-2">Hero Subtitle</label>
                  <input
                    type="text"
                    value={storeSubheading}
                    onChange={(e) => setStoreSubheading(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-white mb-2">Primary Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <span className="font-mono text-slate-300 font-bold">{primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-white mb-2">Typography</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Editorial)</option>
                    <option value="Inter">Inter (Clean Neutral)</option>
                    <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Canvas Preview Area */}
        <div className="flex-1 bg-[#070a12] p-6 flex items-center justify-center overflow-auto">
          <div
            className={`transition-all duration-300 bg-white text-slate-900 rounded-2xl shadow-2xl overflow-y-auto flex flex-col ${
              deviceView === 'desktop' ? 'w-full h-full max-w-5xl max-h-[800px]' :
              deviceView === 'tablet' ? 'w-[768px] h-[750px]' :
              'w-[380px] h-[680px] rounded-[36px] border-8 border-slate-900'
            }`}
          >
            {/* Storefront Header */}
            {sections.find(s => s.id === 'announcement')?.enabled && (
              <div className="bg-slate-950 text-white text-[11px] font-bold py-1.5 text-center tracking-wide">
                ✨ Free Express Global Shipping On Orders Over $100
              </div>
            )}

            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="text-xl font-black tracking-tight text-slate-950">
                {store?.name || 'SOLPUMP STORE'}
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <span>Collections</span>
                <span>Best Sellers</span>
                <span>About</span>
                <div className="relative p-2 bg-slate-100 rounded-full">
                  <ShoppingBag className="w-4 h-4 text-slate-800" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] flex items-center justify-center font-bold">2</span>
                </div>
              </div>
            </div>

            {/* Storefront Hero */}
            {sections.find(s => s.id === 'hero')?.enabled && (
              <div className="p-8 sm:p-12 bg-gradient-to-br from-slate-50 to-indigo-50/50 flex flex-col items-center text-center">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-3 uppercase tracking-wider">
                  {storeSubheading}
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight max-w-lg mb-4">
                  {storeHeading}
                </h1>
                <p className="text-slate-600 text-sm max-w-md mb-6">
                  Handcrafted premium goods crafted with full-grain materials and lifetime durability.
                </p>
                <button
                  style={{ backgroundColor: primaryColor }}
                  className="px-6 py-3 rounded-xl text-white font-bold text-xs shadow-lg shadow-indigo-600/20"
                >
                  Shop The Collection &rarr;
                </button>
              </div>
            )}

            {/* Featured Products */}
            {sections.find(s => s.id === 'featured_products')?.enabled && (
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-slate-950">Featured Products</h3>
                  <span className="text-xs font-bold text-indigo-600 cursor-pointer">View all ({products.length})</span>
                </div>
                <div className={`grid gap-4 ${deviceView === 'mobile' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {products.slice(0, 3).map((prod) => (
                    <div key={prod.id} className="group rounded-xl border border-slate-100 p-3 hover:shadow-md transition">
                      <img src={prod.image} alt={prod.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                      <div className="text-xs font-bold text-slate-900 truncate">{prod.title}</div>
                      <div className="text-xs font-extrabold text-indigo-600 mt-1">${prod.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Storefront Footer */}
            {sections.find(s => s.id === 'footer')?.enabled && (
              <div className="p-6 bg-slate-950 text-white text-xs text-center border-t border-slate-800">
                <p className="text-slate-400">© 2026 {store?.name || 'Sol Pump Store'}. Powered by SOLPUMP Commerce OS.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
