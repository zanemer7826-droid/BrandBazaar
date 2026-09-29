import React, { useState } from 'react';
import {
  X,
  Key,
  Code,
  Sparkles,
  Layers,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { PRESET_TEMPLATES } from '../data/sampleStitchProject';
import { DesignTokens } from '../types';

interface StitchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  onApplyCustomHtml: (html: string, name: string) => void;
  onApplyTemplate: (templateId: string) => void;
  onUpdateTokens: (tokens: Partial<DesignTokens>) => void;
}

export const StitchImportModal: React.FC<StitchImportModalProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  onApplyCustomHtml,
  onApplyTemplate,
  onUpdateTokens,
}) => {
  const [activeTab, setActiveTab] = useState<'apiKey' | 'pasteCode' | 'presets' | 'aiGenerate'>('pasteCode');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [projectIdInput, setProjectIdInput] = useState(currentProjectId);
  const [pastedCode, setPastedCode] = useState('');
  const [codeName, setCodeName] = useState('Imported Stitch Screen');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  // Handle Stitch API Key connection
  const handleConnectApiKey = async () => {
    if (!apiKeyInput.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid Stitch API key.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Connecting to Stitch MCP server...' });

    try {
      const res = await fetch('/api/stitch/fetch-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectIdInput.trim(),
          apiKey: apiKeyInput.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: `Successfully connected to project ${projectIdInput}! Loaded screens.`,
        });
        if (data.screens?.content) {
          onApplyCustomHtml(data.screens.content, `Stitch #${projectIdInput}`);
        }
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to authenticate with Stitch MCP. Verify key in stitch.withgoogle.com/settings.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Network error: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Pasted Code Import
  const handleImportPastedCode = () => {
    if (!pastedCode.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste HTML or Tailwind markup first.' });
      return;
    }
    onApplyCustomHtml(pastedCode, codeName);
    onClose();
  };

  // Handle AI Generation
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      setStatusMessage({ type: 'error', text: 'Please describe the website page or section you want to create.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Gemini is synthesizing responsive Stitch UI code...' });

    try {
      const res = await fetch('/api/stitch/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
        }),
      });
      const data = await res.json();

      if (data.success && data.code) {
        onApplyCustomHtml(data.code, `AI: ${aiPrompt.slice(0, 30)}...`);
        onClose();
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Could not generate code. Please try again.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Generation error: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Stitch Project Bridge
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sync or import from Stitch #{currentProjectId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60 px-6 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pasteCode')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'pasteCode'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Paste Stitch Code</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Stitch Templates</span>
          </button>

          <button
            onClick={() => setActiveTab('apiKey')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'apiKey'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Stitch API Key</span>
          </button>

          <button
            onClick={() => setActiveTab('aiGenerate')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'aiGenerate'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Prompt Builder</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-4">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start space-x-2 ${
                statusMessage.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                  : statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60'
              }`}
            >
              {statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: PASTE CODE */}
          {activeTab === 'pasteCode' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 flex items-start space-x-2.5">
                <div className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <Code className="w-4 h-4" />
                </div>
                <div className="text-xs text-indigo-900 dark:text-indigo-200">
                  <p className="font-semibold mb-0.5">Direct Stitch Screen Export</p>
                  <p className="opacity-90">
                    Open your canvas at{' '}
                    <a
                      href={`https://stitch.withgoogle.com/projects/${currentProjectId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      stitch.withgoogle.com/projects/{currentProjectId}
                    </a>
                    , click on any screen, select <strong>&quot;Export&quot;</strong> or{' '}
                    <strong>&quot;&lt;&gt; Code&quot;</strong>, and paste the HTML / Tailwind code below!
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Screen Label / Name
                </label>
                <input
                  type="text"
                  value={codeName}
                  onChange={(e) => setCodeName(e.target.value)}
                  placeholder="e.g. Hero Section, Dashboard, Checkout Page"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pasted HTML / Tailwind Markup
                </label>
                <textarea
                  rows={8}
                  value={pastedCode}
                  onChange={(e) => setPastedCode(e.target.value)}
                  placeholder={`<section class="relative bg-slate-900 text-white py-20 px-6">\n  <div class="max-w-5xl mx-auto text-center">\n    <h1 class="text-5xl font-extrabold tracking-tight">Your Stitch Hero</h1>\n    ...\n  </div>\n</section>`}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleImportPastedCode}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md flex items-center space-x-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Mount & Render Page</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PRESET TEMPLATES */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a pre-built complete website template created with Google Stitch design systems:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {PRESET_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all flex items-center justify-between bg-white dark:bg-slate-800/50 group"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tmpl.primary }}
                        />
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {tmpl.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-medium text-slate-600 dark:text-slate-300">
                          {tmpl.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {tmpl.description}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onApplyTemplate(tmpl.id);
                        onUpdateTokens({ primaryColor: tmpl.primary, accentColor: tmpl.accent });
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shrink-0 shadow-xs"
                    >
                      Load Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STITCH API KEY */}
          {activeTab === 'apiKey' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2.5">
                <Key className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="font-semibold mb-0.5">Google Stitch Authentication</p>
                  <p className="opacity-90">
                    Stitch projects are protected by Google Cloud IAM. Generate an API Key from{' '}
                    <a
                      href="https://stitch.withgoogle.com/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      stitch.withgoogle.com/settings
                    </a>{' '}
                    to enable live sync.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stitch Project ID
                </label>
                <input
                  type="text"
                  value={projectIdInput}
                  onChange={(e) => setProjectIdInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stitch API Key (X-Goog-Api-Key)
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleConnectApiKey}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md flex items-center space-x-1.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Connect Stitch Project</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: AI PROMPT */}
          {activeTab === 'aiGenerate' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="font-semibold mb-0.5">Synthesize with Gemini 2.5</p>
                  <p className="opacity-90">
                    Describe what website or screen you want to generate. It will be built strictly following the active Stitch design tokens.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Website Prompt
                </label>
                <textarea
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Build an interactive AI analytics dashboard with real-time server latency, query throughput metrics, and filter buttons."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAiGenerate}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-md flex items-center space-x-1.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Website Screen</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
