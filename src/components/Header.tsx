import React from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Sliders,
  Code2,
  Key,
  Layers,
  Sparkles,
  ExternalLink,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react';
import { ViewportMode, ActiveTab, DesignTokens } from '../types';

interface HeaderProps {
  projectId: string;
  projectName: string;
  viewport: ViewportMode;
  setViewport: (mode: ViewportMode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDesignDrawer: () => void;
  onOpenImportModal: () => void;
  onOpenExportModal: () => void;
  designTokens: DesignTokens;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectId,
  projectName,
  viewport,
  setViewport,
  activeTab,
  setActiveTab,
  onOpenDesignDrawer,
  onOpenImportModal,
  onOpenExportModal,
  designTokens,
  toggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-200 bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
      {/* Top Banner explaining Stitch Status */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-white/20 text-white">
            <Sparkles className="w-3 h-3 mr-1" /> Google Stitch
          </span>
          <span className="font-medium truncate">
            Target Project: <code className="bg-black/20 px-1.5 py-0.5 rounded font-mono font-semibold">#{projectId}</code>
          </span>
          <span className="hidden md:inline-flex items-center text-indigo-100">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-300" />
            Website Engine Active
          </span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onOpenImportModal}
            className="flex items-center font-medium underline hover:text-white/80 transition-colors"
          >
            <Key className="w-3 h-3 mr-1" />
            Connect API Key / Paste Export
          </button>
          <a
            href={`https://stitch.withgoogle.com/projects/${projectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center font-medium opacity-90 hover:opacity-100 transition-opacity"
          >
            Open in Stitch <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Project Switcher */}
        <div className="flex items-center space-x-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20"
            style={{ backgroundColor: designTokens.primaryColor }}
          >
            S
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-sm sm:text-base tracking-tight truncate text-slate-900 dark:text-white">
                {projectName}
              </h1>
              <span className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                Live Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Stitch #{projectId}
            </p>
          </div>
        </div>

        {/* Center Tabs: Website vs Dashboard vs Components vs Custom */}
        <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('website')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
              activeTab === 'website'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home / Landing
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            App Dashboard
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
              activeTab === 'components'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Stitch Tokens & UI
          </button>
          <button
            onClick={() => setActiveTab('custom-import')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 flex items-center space-x-1 ${
              activeTab === 'custom-import'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 mr-1 text-indigo-500" />
            Paste / Custom
          </button>
        </nav>

        {/* Right Tools: Viewport switch, Design tokens, Code Export */}
        <div className="flex items-center space-x-2">
          {/* Responsive viewport selector */}
          <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewport('desktop')}
              title="Desktop View (1440px)"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === 'desktop'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              title="Tablet View (768px)"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === 'tablet'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              title="Mobile View (375px)"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === 'mobile'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('full')}
              title="Full Width (100%)"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === 'full'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Design System button */}
          <button
            onClick={onOpenDesignDrawer}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Theme Vibe</span>
          </button>

          {/* Code Export button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-95"
            style={{ backgroundColor: designTokens.primaryColor }}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Export Code</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Dark / Light Theme"
          >
            {designTokens.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 overflow-x-auto py-2 px-4 gap-2 text-xs">
        <button
          onClick={() => setActiveTab('website')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            activeTab === 'website' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Landing
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            activeTab === 'components' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Tokens & UI
        </button>
        <button
          onClick={() => setActiveTab('custom-import')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            activeTab === 'custom-import' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Paste Code
        </button>
      </div>
    </header>
  );
};
