import React from 'react';
import { Shield, Sparkles, Sliders, ListOrdered, BarChart3, GitCompare, Database, HelpCircle } from 'lucide-react';
import { UserPreferences } from '../types/counselling';

export type ActiveTab =
  | 'predictor'
  | 'optimizer'
  | 'simulator'
  | 'trends'
  | 'scenarios'
  | 'transparency'
  | 'admin';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectPreset: (preset: UserPreferences) => void;
  onOpenDemo: () => void;
}

export const PRESET_PROFILES: { label: string; tag: string; prefs: UserPreferences }[] = [
  {
    label: 'Aarav Sharma',
    tag: 'JEE Adv #3,420 (OBC)',
    prefs: {
      exam: 'JEE_ADVANCED',
      crlRank: 3420,
      categoryRank: 820,
      category: 'OBC-NCL',
      gender: 'Gender-Neutral',
      homeState: 'Uttar Pradesh',
      preferredInstituteTypes: ['IIT'],
      preferredBranchGroups: ['CSE', 'AI_DS', 'MNC', 'ECE', 'EE', 'ME', 'CE'],
      priorityWeight: 'BALANCED',
    },
  },
  {
    label: 'Priya Patel',
    tag: 'JEE Main #12,540 (Gen-F)',
    prefs: {
      exam: 'JEE_MAIN',
      crlRank: 12540,
      category: 'OPEN',
      gender: 'Female-only',
      homeState: 'Gujarat',
      preferredInstituteTypes: ['NIT', 'IIIT'],
      preferredBranchGroups: ['CSE', 'AI_DS', 'ECE'],
      priorityWeight: 'BRANCH_FIRST',
    },
  },
  {
    label: 'Aditya Verma',
    tag: 'JEE Main #4,890 (Gen)',
    prefs: {
      exam: 'JEE_MAIN',
      crlRank: 4890,
      category: 'OPEN',
      gender: 'Gender-Neutral',
      homeState: 'Maharashtra',
      preferredInstituteTypes: ['NIT', 'IIIT'],
      preferredBranchGroups: ['CSE', 'AI_DS', 'ECE', 'EE'],
      priorityWeight: 'INSTITUTE_FIRST',
    },
  },
  {
    label: 'Kavya Soren',
    tag: 'JEE Adv #8,900 (SC)',
    prefs: {
      exam: 'JEE_ADVANCED',
      crlRank: 8900,
      categoryRank: 420,
      category: 'SC',
      gender: 'Female-only',
      homeState: 'Jharkhand',
      preferredInstituteTypes: ['IIT'],
      preferredBranchGroups: ['CSE', 'AI_DS', 'ECE', 'EE', 'ME'],
      priorityWeight: 'BALANCED',
    },
  },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSelectPreset,
  onOpenDemo,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <span className="text-lg tracking-tight font-black">RP</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white">RankPath</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  JoSAA 2025 Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Admission Probability Engine &amp; Choice Optimiser
              </p>
            </div>
          </div>

          {/* Quick Profile Switcher & Actions */}
          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
              <span className="text-slate-400 px-2 font-medium">Try Profile:</span>
              {PRESET_PROFILES.map((p) => (
                <button
                  key={p.label}
                  id={`btn-preset-${p.label.toLowerCase().replace(' ', '-')}`}
                  onClick={() => onSelectPreset(p.prefs)}
                  className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition font-medium text-xs flex items-center space-x-1"
                  title={p.tag}
                >
                  <span>{p.label.split(' ')[0]}</span>
                  <span className="text-[10px] text-emerald-400 opacity-80">({p.prefs.exam === 'JEE_ADVANCED' ? 'Adv' : 'Main'})</span>
                </button>
              ))}
            </div>

            <button
              id="btn-open-demo"
              onClick={onOpenDemo}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>2-Min Demo</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60 text-sm">
          <button
            id="nav-tab-predictor"
            onClick={() => setActiveTab('predictor')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md font-medium whitespace-nowrap transition text-xs sm:text-sm ${
              activeTab === 'predictor'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Rank Predictor</span>
          </button>

          <button
            id="nav-tab-optimizer"
            onClick={() => setActiveTab('optimizer')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md font-medium whitespace-nowrap transition text-xs sm:text-sm ${
              activeTab === 'optimizer'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Choice Optimiser</span>
          </button>

          <button
            id="nav-tab-simulator"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md font-medium whitespace-nowrap transition text-xs sm:text-sm ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Round Simulator</span>
          </button>

          <button
            id="nav-tab-trends"
            onClick={() => setActiveTab('trends')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md font-medium whitespace-nowrap transition text-xs sm:text-sm ${
              activeTab === 'trends'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Trend Intelligence</span>
          </button>

          <button
            id="nav-tab-scenarios"
            onClick={() => setActiveTab('scenarios')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md font-medium whitespace-nowrap transition text-xs sm:text-sm ${
              activeTab === 'scenarios'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Scenario Comparison</span>
          </button>

          <button
            id="nav-tab-transparency"
            onClick={() => setActiveTab('transparency')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md font-medium whitespace-nowrap transition text-xs sm:text-sm ${
              activeTab === 'transparency'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Transparency &amp; Model</span>
          </button>

          <button
            id="nav-tab-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md font-medium whitespace-nowrap transition text-xs sm:text-sm ${
              activeTab === 'admin'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Admin &amp; Ingestion</span>
          </button>
        </div>
      </div>
    </header>
  );
};
