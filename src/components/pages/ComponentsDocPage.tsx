import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Info,
  Sliders,
  Send,
  Eye,
} from 'lucide-react';
import { DesignTokens } from '../../types';

interface ComponentsDocPageProps {
  designTokens: DesignTokens;
  onOpenDesignDrawer: () => void;
}

export const ComponentsDocPage: React.FC<ComponentsDocPageProps> = ({
  designTokens,
  onOpenDesignDrawer,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(true);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Stitch Design System Tokens &amp; Components
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              Vibe UI Kit
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Living component library reflecting current global tokens for Project #6599565647522340161
          </p>
        </div>

        <button
          onClick={onOpenDesignDrawer}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center space-x-1.5 transition-all hover:opacity-90"
          style={{ backgroundColor: designTokens.primaryColor }}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Tune Tokens</span>
        </button>
      </div>

      {/* 1. TOKENS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-400">Primary Color</div>
          <div className="flex items-center space-x-2 mt-2">
            <span
              className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700"
              style={{ backgroundColor: designTokens.primaryColor }}
            />
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {designTokens.primaryColor}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-400">Accent Color</div>
          <div className="flex items-center space-x-2 mt-2">
            <span
              className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700"
              style={{ backgroundColor: designTokens.accentColor }}
            />
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {designTokens.accentColor}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-400">Border Radius</div>
          <div className="flex items-center space-x-2 mt-2">
            <div
              className={`w-5 h-5 border-2 border-indigo-500 ${designTokens.borderRadius}`}
            />
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {designTokens.radiusPx} ({designTokens.borderRadius})
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-400">Font Family</div>
          <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
            {designTokens.fontFamily}
          </div>
        </div>
      </div>

      {/* 2. BUTTONS SECTION */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Button Component Archetypes
          </h2>
          <span className="text-xs text-slate-400">Tailwind utilities</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* Primary */}
          <button
            className={`px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-150 hover:opacity-90 ${designTokens.borderRadius}`}
            style={{ backgroundColor: designTokens.primaryColor }}
          >
            Primary Action
          </button>

          {/* Secondary */}
          <button
            className={`px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all ${designTokens.borderRadius}`}
          >
            Secondary
          </button>

          {/* Accent */}
          <button
            className={`px-4 py-2 text-xs font-bold text-white shadow-md transition-all ${designTokens.borderRadius}`}
            style={{ backgroundColor: designTokens.accentColor }}
          >
            Accent Highlight
          </button>

          {/* Subtle / Ghost */}
          <button
            className={`px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${designTokens.borderRadius}`}
          >
            Ghost Action
          </button>

          {/* Destructive */}
          <button
            className={`px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors ${designTokens.borderRadius}`}
          >
            Destructive
          </button>
        </div>
      </section>

      {/* 3. BADGES & CHIPS */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Status Badges &amp; Tags
          </h2>
          <span className="text-xs text-slate-400">Micro-indicators</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Active Online
          </span>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Maintenance
          </span>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
            Alert Raised
          </span>

          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-xs"
            style={{ backgroundColor: designTokens.primaryColor }}
          >
            Stitch Token Vibe
          </span>
        </div>
      </section>

      {/* 4. FORM INPUTS & CONTROLS */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Form Controls &amp; Inputs
          </h2>
          <span className="text-xs text-slate-400">Accessible UI</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Text Input Field
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter something..."
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${designTokens.borderRadius}`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Dropdown
            </label>
            <select
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${designTokens.borderRadius}`}
            >
              <option>Google Stitch Vibe Preset</option>
              <option>Custom Token Palette</option>
              <option>Material 3 Dynamic Theme</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="stitch-check"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="stitch-check" className="text-xs text-slate-700 dark:text-slate-300">
              Automatically keep tokens in sync with Stitch MCP
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};
