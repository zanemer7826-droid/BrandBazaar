import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Layers,
  ChevronDown,
  Check,
  Star,
  Users,
  Clock,
  TrendingUp,
  Cpu,
  BarChart3,
  Play,
  CheckCircle,
} from 'lucide-react';
import { DesignTokens } from '../../types';

interface LandingPageProps {
  designTokens: DesignTokens;
  onNavigateToApp: () => void;
  onOpenDesignDrawer: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  designTokens,
  onNavigateToApp,
  onOpenDesignDrawer,
}) => {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [teamSize, setTeamSize] = useState(15);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [demoTab, setDemoTab] = useState<'agent' | 'canvas' | 'telemetry'>('agent');

  // ROI calculations
  const hoursSavedPerWeek = Math.round(teamSize * 6.5);
  const annualSavingsDollars = (hoursSavedPerWeek * 52 * 85).toLocaleString();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      setTimeout(() => setNewsletterSubmitted(false), 4000);
      setNewsletterEmail('');
    }
  };

  const faqs = [
    {
      q: 'How does Google Stitch integrate with this application?',
      a: 'This website is built directly around the design tokens, layout hierarchy, and vibe aesthetics defined in your Stitch project. It uses Tailwind CSS utility tokens synchronized with your Stitch MCP canvas.',
    },
    {
      q: 'Can I export clean HTML, CSS, and React code?',
      a: 'Yes! Click "Export Code" in the top bar to inspect, copy, or download a full production-ready HTML document or React TSX component matching your active design tokens.',
    },
    {
      q: 'How do the Stitch vibe design tokens work?',
      a: 'You can customize primary colors, accent colors, typography fonts (Google Sans, Inter, Plus Jakarta Sans), and corner roundness via the "Theme Vibe" button. Every component dynamically inherits these tokens.',
    },
    {
      q: 'Does it support responsive viewports?',
      a: 'Yes, seamlessly. Use the top viewport switcher to preview the site in Desktop (1440px), Tablet (768px), Mobile (375px), or Full Responsive mode.',
    },
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Ambient Gradient Glows */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: designTokens.primaryColor }}
        />
        <div
          className="absolute top-48 right-10 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: designTokens.accentColor }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600 dark:text-slate-300">
                Stitch 2.5 Architecture Active
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                Project #6599565647522340161
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Design with AI.{' '}
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, ${designTokens.primaryColor}, ${designTokens.accentColor})`,
                }}
              >
                Ship Production Apps.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Transform high-fidelity Google Stitch canvas sketches into interactive, responsive,
              production-grade web applications with unified design tokens and seamless developer handoff.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onNavigateToApp}
                className={`px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98] ${designTokens.borderRadius}`}
                style={{
                  backgroundColor: designTokens.primaryColor,
                  boxShadow: `0 10px 25px -5px ${designTokens.primaryColor}40`,
                }}
              >
                <span>Launch Core Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDesignDrawer}
                className={`px-6 py-3.5 text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-slate-800 dark:text-slate-200 flex items-center space-x-2 shadow-xs ${designTokens.borderRadius}`}
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Customize Vibe Tokens</span>
              </button>
            </div>

            {/* Social Proof Counter */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1.5">
                  {['#6366f1', '#06b6d4', '#10b981', '#f59e0b'].map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ backgroundColor: color }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  4,800+ teams
                </span>
                <span>building with Stitch</span>
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 font-semibold text-slate-700 dark:text-slate-200">
                  4.9/5
                </span>
                <span>developer rating</span>
              </div>
            </div>
          </div>

          {/* 2. INTERACTIVE PRODUCT DEMO CANVAS WIDGET */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div
              className={`p-1.5 sm:p-2.5 rounded-2xl bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-700/80`}
            >
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Window Top Bar */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-xs font-mono text-slate-400 truncate hidden sm:inline">
                      stitch://project/6599565647522340161/live-preview
                    </span>
                  </div>

                  {/* Demo Tabs */}
                  <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                    <button
                      onClick={() => setDemoTab('agent')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        demoTab === 'agent'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      AI Agent
                    </button>
                    <button
                      onClick={() => setDemoTab('canvas')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        demoTab === 'canvas'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Design Canvas
                    </button>
                    <button
                      onClick={() => setDemoTab('telemetry')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        demoTab === 'telemetry'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Telemetry
                    </button>
                  </div>
                </div>

                {/* Demo Content Inside Window */}
                <div className="p-6 sm:p-8">
                  {demoTab === 'agent' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                            Stitch Agent Prompt Pipeline
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                            Synced &bull; 9ms Latency
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>User Prompt:</span>
                            <span className="font-mono">model: gemini-3.8-flash</span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                            &ldquo;Generate a high-converting enterprise SaaS landing page with dark vibe,
                            metric cards, and interactive pricing switch.&rdquo;
                          </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                            <div className="text-xs text-slate-500">Components</div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">24</div>
                            <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">100% responsive</div>
                          </div>
                          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                            <div className="text-xs text-slate-500">Design Tokens</div>
                            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">42</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">M3 Compliant</div>
                          </div>
                          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 col-span-2 sm:col-span-1">
                            <div className="text-xs text-slate-500">Render Speed</div>
                            <div className="text-xl font-bold text-emerald-500 mt-1">&lt; 12ms</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">GPU acceleration</div>
                          </div>
                        </div>
                      </div>

                      {/* Right Panel in Demo */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Active Vibe Matrix
                          </h4>
                          <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Theme</span>
                              <span className="font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                                {designTokens.primaryColor}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Radius</span>
                              <span className="font-semibold">{designTokens.radiusPx}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Font</span>
                              <span className="font-semibold">{designTokens.fontFamily}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Mode</span>
                              <span className="font-semibold">{designTokens.darkMode ? 'Dark' : 'Light'}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={onNavigateToApp}
                          className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs flex items-center justify-center space-x-1.5"
                        >
                          <span>Open Full App Experience</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {demoTab === 'canvas' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          Infinite Design Canvas (Stitch Architecture)
                        </div>
                        <span className="text-xs text-slate-400">4 Connected Screens</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Landing Page', 'App Dashboard', 'Mobile Feed', 'Token Library'].map((screen, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-indigo-500 transition-all cursor-pointer group"
                          >
                            <div className="aspect-video rounded-lg bg-slate-200 dark:bg-slate-700/60 mb-2 flex items-center justify-center text-slate-400 group-hover:text-indigo-500">
                              <Layers className="w-6 h-6" />
                            </div>
                            <div className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">
                              {screen}
                            </div>
                            <div className="text-[10px] text-slate-400">Ready to export</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {demoTab === 'telemetry' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          Real-time Performance Metrics
                        </div>
                        <span className="text-xs text-emerald-500 font-semibold">Healthy (99.99%)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500">Edge TTFB</div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">18ms</div>
                          <div className="text-xs text-emerald-500 font-medium">99th percentile</div>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500">Lighthouse Score</div>
                          <div className="text-2xl font-bold text-emerald-500 mt-1">99/100</div>
                          <div className="text-xs text-slate-400 font-medium">Zero Cumulative Shift</div>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500">Asset Bundle Size</div>
                          <div className="text-2xl font-bold text-indigo-500 mt-1">42 kB</div>
                          <div className="text-xs text-slate-400 font-medium">Tree-shaken Tailwind</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Engineered For Speed &amp; Quality
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Everything You Need To Build From Stitch
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            A unified stack bridging generative UI exploration with clean production code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Instant Canvas to Code',
              desc: 'Convert any Stitch design canvas into semantic Tailwind HTML and React code with full reactive state.',
              badge: 'Real-time',
            },
            {
              icon: Layers,
              title: 'Dynamic Design Tokens',
              desc: 'Configure primary colors, fonts, and corner radius globally. All components update automatically in unison.',
              badge: 'M3 Tokens',
            },
            {
              icon: Cpu,
              title: 'Gemini 3 Enhanced',
              desc: 'Leverage state-of-the-art multimodal reasoning to generate auxiliary pages and components on demand.',
              badge: 'Gemini 3.8',
            },
            {
              icon: Shield,
              title: 'Production-Ready Architecture',
              desc: 'No messy spaghetti code. Clean, modular, standards-compliant TypeScript with zero telemetry overhead.',
              badge: 'Zero Debt',
            },
            {
              icon: BarChart3,
              title: 'Integrated SaaS Cockpit',
              desc: 'Out-of-the-box analytical dashboards, metric telemetry, filterable activity feeds, and data tables.',
              badge: 'Full Suite',
            },
            {
              icon: TrendingUp,
              title: 'Device Viewport Matrix',
              desc: 'Effortlessly audit designs across Desktop (1440px), Tablet (768px), and Mobile (375px) breakpoints.',
              badge: 'Responsive',
            },
          ].map((f, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group relative`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: designTokens.primaryColor }}
                >
                  <f.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {f.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE ROI CALCULATOR */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Measurable Impact
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                How Much Time Will Stitch Save Your Team?
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Drag the slider to adjust your engineering and product design team size and see projected
                quarterly savings.
              </p>

              {/* Slider Control */}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Team Size:</span>
                  <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold">
                    {teamSize} Engineers &amp; Designers
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>2 people</span>
                  <span>50 people</span>
                  <span>100+ people</span>
                </div>
              </div>
            </div>

            {/* Metric Output Card */}
            <div
              className={`p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <div className="text-xs text-slate-500 font-medium">Weekly Hours Saved</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {hoursSavedPerWeek}h
                  </div>
                  <div className="text-[11px] text-emerald-500 font-semibold mt-1">
                    +65% Velocity
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <div className="text-xs text-slate-500 font-medium">Projected Annual ROI</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                    ${annualSavingsDollars}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Based on standard rate
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Eliminates 90% of boilerplate CSS and responsive refactoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Immediate synchronization with Figma and Stitch MCP</span>
                </div>
              </div>

              <button
                onClick={onNavigateToApp}
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md"
              >
                Experience Live Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING TIERS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Simple, Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Choose The Plan That Scales With You
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Get started for free or upgrade to unlock unlimited generative iterations and dedicated MCP bridges.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-4 flex items-center justify-center space-x-3">
            <span
              className={`text-xs font-medium ${
                !annualBilling ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="w-12 h-6 rounded-full bg-slate-300 dark:bg-slate-700 p-0.5 transition-colors relative"
            >
              <div
                className={`w-5 h-5 rounded-full bg-indigo-600 shadow-sm transition-transform ${
                  annualBilling ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center space-x-1.5">
              <span
                className={`text-xs font-medium ${
                  annualBilling ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'
                }`}
              >
                Annual
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {[
            {
              name: 'Starter',
              desc: 'Ideal for solo developers exploring Stitch design conversions.',
              priceMonthly: 0,
              priceAnnual: 0,
              features: [
                'Up to 3 Stitch projects',
                'Export to Tailwind HTML',
                'Standard M3 token editor',
                'Community support forum',
              ],
              popular: false,
              cta: 'Get Started Free',
            },
            {
              name: 'Professional',
              desc: 'For product teams shipping weekly web applications with AI.',
              priceMonthly: 29,
              priceAnnual: 24,
              features: [
                'Unlimited Stitch projects',
                'Direct Stitch MCP live synchronization',
                'Full React TSX & Tailwind code exports',
                'Gemini 3.8 generative assistant integration',
                'Priority edge build runner',
              ],
              popular: true,
              cta: 'Start 14-Day Pro Trial',
            },
            {
              name: 'Enterprise',
              desc: 'For large organizations requiring SSO, RBAC, and dedicated MCP.',
              priceMonthly: 99,
              priceAnnual: 79,
              features: [
                'Dedicated MCP proxy and SLA',
                'Custom corporate design token catalogs',
                'Google Cloud IAM & SSO integration',
                'Audit logging & SOC2 compliance docs',
                'Dedicated solutions engineer',
              ],
              popular: false,
              cta: 'Contact Sales',
            },
          ].map((tier, idx) => {
            const price = annualBilling ? tier.priceAnnual : tier.priceMonthly;
            return (
              <div
                key={idx}
                className={`p-8 rounded-2xl flex flex-col justify-between transition-all duration-200 relative ${
                  tier.popular
                    ? 'border-2 border-indigo-600 bg-white dark:bg-slate-900 shadow-2xl scale-[1.02]'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white shadow-md">
                    Most Popular Choice
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {tier.desc}
                    </p>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ month</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onNavigateToApp}
                  className={`mt-8 w-full py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                    tier.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                      : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Answers regarding Stitch projects, Google IAM, tokens, and code generation.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/60"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-indigo-500' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. NEWSLETTER & FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-16 pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100 dark:border-slate-800">
            {/* Col 1 */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center space-x-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: designTokens.primaryColor }}
                >
                  S
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                  Stitch Web Studio
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Built for Google Stitch Project #6599565647522340161 with live interactive vibe tokens.
              </p>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Product
              </h4>
              <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
                <li><button onClick={onNavigateToApp} className="hover:text-indigo-600">Core Dashboard</button></li>
                <li><button onClick={onOpenDesignDrawer} className="hover:text-indigo-600">Design Tokens</button></li>
                <li><a href="#pricing" className="hover:text-indigo-600">Pricing Matrix</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Stitch Ecosystem
              </h4>
              <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
                <li><a href="https://stitch.withgoogle.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600">Stitch Web App</a></li>
                <li><a href="https://github.com/google-labs-code/stitch-sdk" target="_blank" rel="noreferrer" className="hover:text-indigo-600">Stitch SDK on GitHub</a></li>
                <li><a href="https://stitch.withgoogle.com/settings" target="_blank" rel="noreferrer" className="hover:text-indigo-600">API Key Settings</a></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Stay Updated
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Get notified when new Stitch design models and tokens are released.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 transition-colors"
                >
                  Join
                </button>
              </form>
              {newsletterSubmitted && (
                <p className="text-emerald-500 text-xs font-medium">Thank you for subscribing!</p>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px]">
            <p>&copy; {new Date().getFullYear()} Stitch Web Studio. Generated for Project #6599565647522340161.</p>
            <p className="mt-2 sm:mt-0">Built with Google AI Studio &bull; React &bull; Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
