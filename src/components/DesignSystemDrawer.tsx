import React from 'react';
import { X, Check, RefreshCw, Palette, Type, Box, Moon, Sun } from 'lucide-react';
import { DesignTokens } from '../types';
import { COLOR_PALETTES, FONT_OPTIONS } from '../data/sampleStitchProject';

interface DesignSystemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  designTokens: DesignTokens;
  setDesignTokens: React.Dispatch<React.SetStateAction<DesignTokens>>;
}

export const DesignSystemDrawer: React.FC<DesignSystemDrawerProps> = ({
  isOpen,
  onClose,
  designTokens,
  setDesignTokens,
}) => {
  if (!isOpen) return null;

  const handlePaletteSelect = (p: typeof COLOR_PALETTES[0]) => {
    setDesignTokens((prev) => ({
      ...prev,
      primaryColor: p.primary,
      primaryHover: p.hover,
      accentColor: p.accent,
    }));
  };

  const handleRadiusChange = (radius: DesignTokens['borderRadius'], px: string) => {
    setDesignTokens((prev) => ({
      ...prev,
      borderRadius: radius,
      radiusPx: px,
    }));
  };

  const handleFontChange = (font: string) => {
    setDesignTokens((prev) => ({
      ...prev,
      fontFamily: font,
    }));
  };

  const resetToDefault = () => {
    setDesignTokens({
      primaryColor: '#4f46e5',
      primaryHover: '#4338ca',
      accentColor: '#06b6d4',
      borderRadius: 'rounded-xl',
      radiusPx: '12px',
      fontFamily: 'Plus Jakarta Sans',
      darkMode: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: designTokens.primaryColor }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Stitch Vibe Design
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Global Design Tokens & Styling
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetToDefault}
                title="Reset to Stitch Defaults"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 dark:text-slate-300">
            {/* 1. Theme Color Palettes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <Palette className="w-4 h-4 mr-1.5 text-indigo-500" />
                  Color Palette Preset
                </label>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {designTokens.primaryColor}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {COLOR_PALETTES.map((p) => {
                  const isSelected = designTokens.primaryColor === p.primary;
                  return (
                    <button
                      key={p.name}
                      onClick={() => handlePaletteSelect(p)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex -space-x-1.5">
                          <span
                            className="w-6 h-6 rounded-full border border-white dark:border-slate-900 shadow-xs"
                            style={{ backgroundColor: p.primary }}
                          />
                          <span
                            className="w-6 h-6 rounded-full border border-white dark:border-slate-900 shadow-xs"
                            style={{ backgroundColor: p.accent }}
                          />
                        </div>
                        <span className="font-medium text-xs sm:text-sm text-slate-900 dark:text-white">
                          {p.name}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Primary Color Input */}
              <div className="mt-3 flex items-center space-x-2">
                <input
                  type="color"
                  value={designTokens.primaryColor}
                  onChange={(e) =>
                    setDesignTokens((prev) => ({
                      ...prev,
                      primaryColor: e.target.value,
                      primaryHover: e.target.value,
                    }))
                  }
                  className="w-9 h-9 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={designTokens.primaryColor}
                  onChange={(e) =>
                    setDesignTokens((prev) => ({
                      ...prev,
                      primaryColor: e.target.value,
                      primaryHover: e.target.value,
                    }))
                  }
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white uppercase"
                  placeholder="#4f46e5"
                />
              </div>
            </div>

            {/* 2. Shape / Corner Radius */}
            <div>
              <label className="font-semibold text-slate-900 dark:text-white flex items-center mb-3">
                <Box className="w-4 h-4 mr-1.5 text-indigo-500" />
                Corner Roundness
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Sharp', radius: 'rounded-md' as const, px: '6px' },
                  { label: 'Smooth', radius: 'rounded-xl' as const, px: '12px' },
                  { label: 'Soft', radius: 'rounded-2xl' as const, px: '20px' },
                  { label: 'Pill', radius: 'rounded-full' as const, px: '9999px' },
                ].map((item) => {
                  const isSelected = designTokens.borderRadius === item.radius;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleRadiusChange(item.radius, item.px)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-2 text-xs transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 font-bold text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 border-2 border-indigo-500 ${item.radius} bg-indigo-500/10`}
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Typography */}
            <div>
              <label className="font-semibold text-slate-900 dark:text-white flex items-center mb-3">
                <Type className="w-4 h-4 mr-1.5 text-indigo-500" />
                Typography Font Family
              </label>
              <div className="space-y-2">
                {FONT_OPTIONS.map((f) => {
                  const isSelected = designTokens.fontFamily === f.name;
                  return (
                    <button
                      key={f.name}
                      onClick={() => handleFontChange(f.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-medium text-slate-900 dark:text-white text-sm">
                          {f.name}
                        </span>
                        <p className="text-xs text-slate-400 font-normal">
                          The quick brown fox jumps over the lazy dog
                        </p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Appearance Mode */}
            <div>
              <label className="font-semibold text-slate-900 dark:text-white flex items-center mb-3">
                Appearance Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDesignTokens((prev) => ({ ...prev, darkMode: false }))}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-semibold ${
                    !designTokens.darkMode
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Canvas</span>
                </button>
                <button
                  onClick={() => setDesignTokens((prev) => ({ ...prev, darkMode: true }))}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-semibold ${
                    designTokens.darkMode
                      ? 'border-indigo-500 bg-indigo-950 text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-400'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dark Canvas</span>
                </button>
              </div>
            </div>

            {/* Live Token Summary Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Stitch Token Matrix
              </h4>
              <div className="text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">--primary-color:</span>
                  <span className="font-semibold">{designTokens.primaryColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">--border-radius:</span>
                  <span className="font-semibold">{designTokens.radiusPx}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">--font-family:</span>
                  <span className="font-semibold">{designTokens.fontFamily}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-opacity hover:opacity-95"
              style={{ backgroundColor: designTokens.primaryColor }}
            >
              Done & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
