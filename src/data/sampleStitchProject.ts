import { StitchProjectData } from '../types';

export const INITIAL_STITCH_PROJECT: StitchProjectData = {
  id: '6599565647522340161',
  name: 'NovaScale - Intelligent Cloud & AI Platform',
  description: 'Full-stack responsive web application generated with Google Stitch design system tokens and Gemini 3 intelligence.',
  ownerEmail: 'zanemer7826@gmail.com',
  updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  designTokens: {
    primaryColor: '#4f46e5', // Indigo 600
    primaryHover: '#4338ca', // Indigo 700
    accentColor: '#06b6d4',  // Cyan 500
    borderRadius: 'rounded-xl',
    radiusPx: '12px',
    fontFamily: 'Plus Jakarta Sans',
    darkMode: true,
  },
  screens: [
    {
      id: 'screen-landing',
      name: 'Landing Page & Product Overview',
      deviceType: 'DESKTOP',
      description: 'High-converting homepage with dynamic hero, interactive feature highlights, ROI estimator, and pricing tiers.',
      timestamp: 'Just now',
    },
    {
      id: 'screen-dashboard',
      name: 'Application Core Dashboard',
      deviceType: 'DESKTOP',
      description: 'Interactive analytics cockpit with real-time KPI metrics, data tables, and deployment workflows.',
      timestamp: '2 hours ago',
    },
    {
      id: 'screen-mobile-app',
      name: 'Mobile Responsive Experience',
      deviceType: 'MOBILE',
      description: 'Touch-optimized mobile interface with bottom navigation bar, quick actions, and card feed.',
      timestamp: '1 day ago',
    },
    {
      id: 'screen-design-tokens',
      name: 'Stitch Design System Tokens & Docs',
      deviceType: 'DESKTOP',
      description: 'Living component library with buttons, badges, inputs, and interactive token switchers.',
      timestamp: '3 days ago',
    },
  ],
};

export const COLOR_PALETTES = [
  {
    name: 'Stitch Indigo',
    primary: '#4f46e5',
    hover: '#4338ca',
    accent: '#06b6d4',
  },
  {
    name: 'Emerald Aurora',
    primary: '#059669',
    hover: '#047857',
    accent: '#10b981',
  },
  {
    name: 'Cyberpunk Violet',
    primary: '#8b5cf6',
    hover: '#7c3aed',
    accent: '#ec4899',
  },
  {
    name: 'Google Material Blue',
    primary: '#1a73e8',
    hover: '#1557b0',
    accent: '#ea4335',
  },
  {
    name: 'Obsidian Minimal',
    primary: '#18181b',
    hover: '#27272a',
    accent: '#64748b',
  },
];

export const FONT_OPTIONS = [
  { name: 'Plus Jakarta Sans', fontClass: 'font-sans' },
  { name: 'Inter', fontClass: 'font-sans' },
  { name: 'Google Sans', fontClass: 'font-sans' },
  { name: 'JetBrains Mono', fontClass: 'font-mono' },
];

export const PRESET_TEMPLATES = [
  {
    id: 'saas-cloud',
    name: 'NovaScale - Cloud & AI Platform',
    category: 'SaaS & Enterprise',
    description: 'Modern enterprise infrastructure dashboard with landing page, pricing, and live analytics.',
    primary: '#4f46e5',
    accent: '#06b6d4',
  },
  {
    id: 'fintech-apex',
    name: 'ApexPay - Digital Treasury & Cards',
    category: 'Fintech & Banking',
    description: 'High-security financial ledger, global transfers, and multi-currency portfolio.',
    primary: '#059669',
    accent: '#34d399',
  },
  {
    id: 'studio-creative',
    name: 'Voxel Studio - Generative 3D Canvas',
    category: 'Design & Media',
    description: 'Next-generation design portfolio with dark aesthetics, spatial cards, and render pipeline.',
    primary: '#8b5cf6',
    accent: '#f43f5e',
  },
];
