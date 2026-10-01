import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Link,
  Sparkles,
  Type,
  Check,
  RotateCcw,
  Palette,
  Eye,
  Camera,
} from 'lucide-react';
import { StoreBrandingSettings } from '../../types/ecommerce';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: StoreBrandingSettings;
  onSaveBranding: (newBranding: StoreBrandingSettings) => void;
  primaryColor?: string;
}

const PRESET_LOGOS = [
  {
    name: 'Royal Bazaar Monogram',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80',
    type: 'Luxury',
  },
  {
    name: 'Minimalist Artisan B',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
    type: 'Artisan',
  },
  {
    name: 'Nordic Clean Studio',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80',
    type: 'Nordic',
  },
  {
    name: 'Golden Crest Emblem',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80',
    type: 'Classic',
  },
  {
    name: 'Modern Cyber Hexagon',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    type: 'Modern',
  },
  {
    name: 'Botanical Leaf Motif',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=200&q=80',
    type: 'Organic',
  },
];

const COLOR_SWATCHES = [
  '#4f46e5', // Indigo
  '#2563eb', // Royal Blue
  '#059669', // Emerald
  '#d97706', // Amber Gold
  '#dc2626', // Crimson Red
  '#7c3aed', // Violet
  '#db2777', // Rose Pink
  '#0f172a', // Midnight Slate
  '#44403c', // Warm Stone
];

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  isOpen,
  onClose,
  branding,
  onSaveBranding,
  primaryColor = '#4f46e5',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets' | 'monogram'>('upload');
  const [localSettings, setLocalSettings] = useState<StoreBrandingSettings>(branding);
  const [urlInput, setUrlInput] = useState(branding.logoImageUrl || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when opened
  React.useEffect(() => {
    if (isOpen) {
      setLocalSettings(branding);
      setUrlInput(branding.logoImageUrl || '');
      setUploadSuccessMessage(null);
      setFileError(null);
      if (branding.logoType === 'letter') {
        setActiveTab('monogram');
      } else if (branding.logoImageUrl) {
        setActiveTab('upload');
      }
    }
  }, [isOpen, branding]);

  if (!isOpen) return null;

  // Process File to Base64
  const processImageFile = (file: File) => {
    setFileError(null);
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('Image file size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        setLocalSettings((prev) => ({
          ...prev,
          logoType: 'image',
          logoImageUrl: dataUrl,
        }));
        setUploadSuccessMessage(`Successfully uploaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setFileError('Please enter a valid image URL.');
      return;
    }
    setLocalSettings((prev) => ({
      ...prev,
      logoType: 'image',
      logoImageUrl: urlInput.trim(),
    }));
    setUploadSuccessMessage('Logo URL applied!');
    setFileError(null);
  };

  const handleSelectPreset = (url: string, name: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      logoType: 'image',
      logoImageUrl: url,
    }));
    setUploadSuccessMessage(`Selected ${name} preset.`);
    setFileError(null);
  };

  const handleSelectMonogram = () => {
    setLocalSettings((prev) => ({
      ...prev,
      logoType: 'letter',
      logoText: prev.logoText || prev.storeName?.charAt(0) || 'B',
    }));
    setUploadSuccessMessage('Monogram Letter style selected.');
    setFileError(null);
  };

  const handleResetToDefault = () => {
    setLocalSettings({
      storeName: 'BRAND BAZAAR',
      storeTagline: 'The Everything Premium Marketplace',
      logoType: 'letter',
      logoText: 'B',
      logoImageUrl: '',
      primaryColor: '#4f46e5',
    });
    setUrlInput('');
    setUploadSuccessMessage('Reset to default Brand Bazaar logo.');
  };

  const handleSaveAndApply = () => {
    onSaveBranding(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Upload &amp; Customize Store Logo
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Change your storefront emblem, monogram, or upload custom branding image
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* LIVE HEADER PREVIEW BOX */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span>Live Storefront Header Preview</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Instant Real-Time Preview
              </span>
            </div>

            {/* Simulated Navbar Row */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5">
                {localSettings.logoType === 'image' && localSettings.logoImageUrl ? (
                  <img
                    src={localSettings.logoImageUrl}
                    alt={localSettings.storeName}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700"
                    onError={() => {
                      setFileError('Unable to load image from URL. Please check the link or upload a file.');
                    }}
                  />
                ) : (
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm"
                    style={{ backgroundColor: localSettings.primaryColor || primaryColor }}
                  >
                    {localSettings.logoText || 'B'}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                      {localSettings.storeName || 'BRAND BAZAAR'}
                    </span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                      FLAGSHIP
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate max-w-xs">
                    {localSettings.storeTagline || 'The Everything Premium Marketplace'}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
                Navbar Preview
              </div>
            </div>
          </div>

          {/* Success or Error Messages */}
          {uploadSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccessMessage}</span>
            </div>
          )}
          {fileError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
              <X className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Navigation Tabs for Upload Mode */}
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="truncate">Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`py-2 px-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'url'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span className="truncate">Image URL</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`py-2 px-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'presets'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="truncate">Presets</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('monogram');
                handleSelectMonogram();
              }}
              className={`py-2 px-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'monogram'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span className="truncate">Monogram</span>
            </button>
          </div>

          {/* TAB 1: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                  isDragOver
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/50 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                    Click to browse or drag and drop your logo file
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports PNG (recommended transparent), JPG, WebP, or SVG &bull; Max 5MB
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Choose Logo File from Device
                </button>
              </div>

              {localSettings.logoImageUrl && localSettings.logoType === 'image' && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <img
                      src={localSettings.logoImageUrl}
                      alt="Current logo"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-600"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Current Logo Image</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Ready to apply</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSettings((prev) => ({
                        ...prev,
                        logoImageUrl: '',
                        logoType: 'letter',
                      }));
                      setUrlInput('');
                    }}
                    className="text-xs text-rose-500 hover:underline font-bold"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: IMAGE URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Direct Web Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/brand-logo.png"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
                >
                  Apply URL
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Paste any publicly accessible image link hosted on Imgur, Unsplash, Cloudinary, AWS S3, or your website.
              </p>
            </div>
          )}

          {/* TAB 3: CURATED PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Choose from pre-designed high-resolution brand emblems:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_LOGOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url, preset.name)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-3 hover:scale-[1.02] ${
                      localSettings.logoImageUrl === preset.url && localSettings.logoType === 'image'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/70 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-10 h-10 rounded-xl object-cover shadow-xs border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                        {preset.name}
                      </p>
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                        {preset.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MONOGRAM / LETTER */}
          {activeTab === 'monogram' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Monogram Letter or Initials
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={localSettings.logoText}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        logoType: 'letter',
                        logoText: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-black text-center uppercase tracking-widest text-slate-900 dark:text-white"
                    placeholder="B"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">1 to 3 letters (e.g. B, BB, V, LUX)</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Brand Color Accent
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {COLOR_SWATCHES.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setLocalSettings({
                            ...localSettings,
                            primaryColor: color,
                          })
                        }
                        className={`w-7 h-7 rounded-xl transition-transform hover:scale-110 flex items-center justify-center ${
                          localSettings.primaryColor === color ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {localSettings.primaryColor === color && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Store Name & Tagline Fields */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 block">
                Store Name
              </label>
              <input
                type="text"
                value={localSettings.storeName}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, storeName: e.target.value })
                }
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="BRAND BAZAAR"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 block">
                Store Tagline
              </label>
              <input
                type="text"
                value={localSettings.storeTagline}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, storeTagline: e.target.value })
                }
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="The Everything Premium Marketplace"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              style={{ backgroundColor: localSettings.primaryColor || primaryColor }}
            >
              <Check className="w-4 h-4" />
              <span>Apply &amp; Save Logo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
