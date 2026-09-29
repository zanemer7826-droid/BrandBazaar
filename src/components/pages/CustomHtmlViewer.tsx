import React, { useState } from 'react';
import { Code, Eye, RefreshCw, Layers, Copy, Check } from 'lucide-react';
import { DesignTokens } from '../../types';

interface CustomHtmlViewerProps {
  customHtml: string;
  screenName: string;
  designTokens: DesignTokens;
  onOpenImportModal: () => void;
}

export const CustomHtmlViewer: React.FC<CustomHtmlViewerProps> = ({
  customHtml,
  screenName,
  designTokens,
  onOpenImportModal,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(customHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: designTokens.primaryColor }}
          >
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {screenName || 'Custom Stitch Canvas Screen'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rendered with active Google Stitch vibe tokens
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1.5 ${
                viewMode === 'code'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Source</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs transition-colors"
            title="Copy Markup"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenImportModal}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90"
            style={{ backgroundColor: designTokens.primaryColor }}
          >
            Replace Screen
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'preview' ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg min-h-[500px]">
          <div
            className="p-6"
            dangerouslySetInnerHTML={{ __html: customHtml }}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[700px]">
          <pre className="whitespace-pre-wrap">{customHtml}</pre>
        </div>
      )}
    </div>
  );
};
