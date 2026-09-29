import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, Code2 } from 'lucide-react';
import { DesignTokens } from '../types';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  designTokens: DesignTokens;
  htmlCode: string;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  designTokens,
  htmlCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'html' | 'react'>('html');

  if (!isOpen) return null;

  const fullHtmlDocument = `<!DOCTYPE html>
<html lang="en" class="${designTokens.darkMode ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stitch Generated Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              DEFAULT: '${designTokens.primaryColor}',
              hover: '${designTokens.primaryHover}',
              accent: '${designTokens.accentColor}',
            }
          },
          fontFamily: {
            sans: ['"${designTokens.fontFamily}"', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
${htmlCode}
</body>
</html>`;

  const reactCodeSnippet = `import React from 'react';

export default function StitchExportPage() {
  return (
    <div className="${designTokens.darkMode ? 'dark ' : ''}min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Generated with Google Stitch & Tailwind CSS */}
      <style>{\`
        :root {
          --primary-color: ${designTokens.primaryColor};
          --border-radius: ${designTokens.radiusPx};
        }
      \`}</style>
      <div dangerouslySetInnerHTML={{ __html: \`${htmlCode.replace(/`/g, '\\`')}\` }} />
    </div>
  );
}`;

  const currentDisplayCode = exportFormat === 'html' ? fullHtmlDocument : reactCodeSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDisplayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentDisplayCode], {
      type: exportFormat === 'html' ? 'text/html' : 'text/javascript',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFormat === 'html' ? 'stitch-website.html' : 'StitchExportPage.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenWindow = () => {
    const newWin = window.open('', '_blank');
    if (newWin) {
      newWin.document.write(fullHtmlDocument);
      newWin.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Export Website Code
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ready-to-deploy Tailwind HTML &amp; React Components
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-xs font-semibold">
              <button
                onClick={() => setExportFormat('html')}
                className={`px-3 py-1 rounded-md transition-all ${
                  exportFormat === 'html'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Full HTML
              </button>
              <button
                onClick={() => setExportFormat('react')}
                className={`px-3 py-1 rounded-md transition-all ${
                  exportFormat === 'react'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                React TSX
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950 font-mono text-xs text-slate-300 relative">
          <pre className="p-2 whitespace-pre-wrap">{currentDisplayCode}</pre>
        </div>

        {/* Actions Bar */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="text-xs text-slate-500 flex items-center space-x-2">
            <span>Primary: <code className="font-mono text-indigo-500 font-bold">{designTokens.primaryColor}</code></span>
            <span>•</span>
            <span>Radius: <code className="font-mono font-bold">{designTokens.radiusPx}</code></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenWindow}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Window</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
