import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Activity,
  Layers,
  Search,
  Filter,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Server,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { DesignTokens } from '../../types';

interface DashboardPageProps {
  designTokens: DesignTokens;
  onOpenImportModal: () => void;
  onOpenDesignDrawer: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  designTokens,
  onOpenImportModal,
  onOpenDesignDrawer,
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DEPLOYED' | 'BUILDING' | 'QUEUED'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockDeployments = [
    {
      id: 'dep-901',
      name: 'Landing Page & Hero v2.4',
      screen: 'Screen #1 (Desktop)',
      author: 'zanemer7826@gmail.com',
      status: 'DEPLOYED' as const,
      latency: '14ms',
      time: '12m ago',
      environment: 'Production',
    },
    {
      id: 'dep-902',
      name: 'User Onboarding Flow',
      screen: 'Screen #3 (Mobile)',
      author: 'zanemer7826@gmail.com',
      status: 'BUILDING' as const,
      latency: '42ms',
      time: '34m ago',
      environment: 'Staging',
    },
    {
      id: 'dep-903',
      name: 'Design System Token Update',
      screen: 'Design Tokens',
      author: 'system.stitch@google',
      status: 'DEPLOYED' as const,
      latency: '11ms',
      time: '2h ago',
      environment: 'Production',
    },
    {
      id: 'dep-904',
      name: 'Interactive Checkout Drawer',
      screen: 'Screen #4 (Tablet)',
      author: 'zanemer7826@gmail.com',
      status: 'QUEUED' as const,
      latency: '--',
      time: '4h ago',
      environment: 'Preview',
    },
    {
      id: 'dep-905',
      name: 'Telemetry & Health Metrics',
      screen: 'Screen #2 (Cockpit)',
      author: 'zanemer7826@gmail.com',
      status: 'DEPLOYED' as const,
      latency: '9ms',
      time: '1d ago',
      environment: 'Production',
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredDeployments = mockDeployments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.screen.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              NovaScale Core Cockpit
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              LIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time pipeline monitoring for Google Stitch Project #6599565647522340161
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-xs ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenDesignDrawer}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs transition-colors"
          >
            Theme Tokens
          </button>

          <button
            onClick={onOpenImportModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center space-x-1.5"
            style={{ backgroundColor: designTokens.primaryColor }}
          >
            <Plus className="w-4 h-4" />
            <span>New Screen</span>
          </button>
        </div>
      </div>

      {/* 1. KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Monthly Recurring',
            value: '$84,250',
            change: '+14.2%',
            trend: 'up',
            icon: TrendingUp,
            sub: 'vs last month',
          },
          {
            title: 'Active Endpoints',
            value: '14,890',
            change: '+28.4%',
            trend: 'up',
            icon: Users,
            sub: '99.98% availability',
          },
          {
            title: 'Average Edge TTFB',
            value: '12.4 ms',
            change: '-4.1 ms',
            trend: 'up',
            icon: Activity,
            sub: 'Cloud Run Global Edge',
          },
          {
            title: 'Stitch Screens',
            value: '4 Loaded',
            change: '100% Synced',
            trend: 'neutral',
            icon: Layers,
            sub: 'Project #6599565647522340161',
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">{kpi.title}</span>
              <kpi.icon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              {kpi.value}
            </div>
            <div className="mt-1 flex items-center space-x-1.5 text-xs">
              <span className="font-semibold text-emerald-500">{kpi.change}</span>
              <span className="text-slate-400">&bull; {kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. ANALYTICS & TIMELINE CHART AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Request Throughput &amp; Ingestion
              </h2>
              <p className="text-xs text-slate-400">
                Continuous telemetry sampled over dynamic serverless nodes
              </p>
            </div>

            {/* Time Filter Buttons */}
            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              {(['24h', '7d', '30d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timeRange === r
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Responsive Bar / Trend Chart */}
          <div className="pt-2">
            <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 px-2 border-b border-slate-100 dark:border-slate-800">
              {[45, 60, 52, 78, 65, 85, 92, 70, 88, 95, 82, 100, 90, 84, 94].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow pointer-events-none z-10">
                    {h * 120} req/s
                  </div>
                  <div
                    className="w-full rounded-t-md transition-all duration-300 group-hover:brightness-110"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i === 11 ? designTokens.primaryColor : `${designTokens.primaryColor}80`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-2 font-mono">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Right Status Column: System Health & Stitch Bridge */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Stitch Cloud Bridge
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time MCP synchronization service
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Stitch MCP Status
                  </span>
                </div>
                <span className="font-bold text-emerald-500">Connected</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Last Polled
                  </span>
                </div>
                <span className="font-mono text-slate-500">Just now</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Project Target
                  </span>
                </div>
                <span className="font-mono text-indigo-500 font-bold">#6599565647522340161</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenImportModal}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Manage Stitch Credentials &amp; Code
          </button>
        </div>
      </div>

      {/* 3. DEPLOYMENTS & SCREENS TABLE */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Stitch Screen Deployments
            </h2>
            <p className="text-xs text-slate-400">
              Active web modules synchronized from canvas to code
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search screens..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">
              {(['ALL', 'DEPLOYED', 'BUILDING', 'QUEUED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    statusFilter === s
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Screen Module</th>
                <th className="pb-3">Source Canvas</th>
                <th className="pb-3">Environment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Latency</th>
                <th className="pb-3">Updated</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredDeployments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pl-2 font-semibold text-slate-900 dark:text-white">
                    {d.name}
                  </td>
                  <td className="py-3 text-slate-500">{d.screen}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {d.environment}
                    </span>
                  </td>
                  <td className="py-3">
                    {d.status === 'DEPLOYED' && (
                      <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Deployed
                      </span>
                    )}
                    {d.status === 'BUILDING' && (
                      <span className="inline-flex items-center text-amber-500 font-semibold">
                        <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" /> Building
                      </span>
                    )}
                    {d.status === 'QUEUED' && (
                      <span className="inline-flex items-center text-slate-400">
                        <Clock className="w-3.5 h-3.5 mr-1" /> Queued
                      </span>
                    )}
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-400">{d.latency}</td>
                  <td className="py-3 text-slate-400">{d.time}</td>
                  <td className="py-3 pr-2 text-right">
                    <button
                      onClick={onOpenImportModal}
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold text-xs"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
