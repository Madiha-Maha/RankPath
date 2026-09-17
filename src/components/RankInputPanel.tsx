import React from 'react';
import {
  UserPreferences,
  InstituteType,
  BranchGroup,
  Category,
  Gender,
  PredictionResult,
} from '../types/counselling';
import { Award, Compass, Sparkles, Filter } from 'lucide-react';

interface RankInputPanelProps {
  preferences: UserPreferences;
  onChange: (newPrefs: UserPreferences) => void;
  predictions: PredictionResult[];
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const INSTITUTE_OPTIONS: { type: InstituteType; label: string; forExam: 'JEE_ADVANCED' | 'JEE_MAIN' | 'BOTH' }[] = [
  { type: 'IIT', label: 'IITs (23 Institutes)', forExam: 'JEE_ADVANCED' },
  { type: 'NIT', label: 'NITs (31 Institutes)', forExam: 'JEE_MAIN' },
  { type: 'IIIT', label: 'IIITs (26 Institutes)', forExam: 'JEE_MAIN' },
  { type: 'GFTI', label: 'GFTIs (38 Institutes)', forExam: 'JEE_MAIN' },
];

const BRANCH_OPTIONS: { group: BranchGroup; label: string }[] = [
  { group: 'CSE', label: 'Computer Science (CSE)' },
  { group: 'AI_DS', label: 'AI & Data Science' },
  { group: 'MNC', label: 'Maths & Computing' },
  { group: 'ECE', label: 'Electronics & Comm (ECE)' },
  { group: 'EE', label: 'Electrical (EE)' },
  { group: 'ME', label: 'Mechanical (ME)' },
  { group: 'CE', label: 'Civil Engg' },
  { group: 'CHE', label: 'Chemical Engg' },
  { group: 'AERO', label: 'Aerospace' },
];

export const RankInputPanel: React.FC<RankInputPanelProps> = ({
  preferences,
  onChange,
  predictions,
}) => {
  const safeCount = predictions.filter((p) => p.bucket === 'SAFE').length;
  const likelyCount = predictions.filter((p) => p.bucket === 'LIKELY').length;
  const targetCount = predictions.filter((p) => p.bucket === 'TARGET').length;
  const reachCount = predictions.filter((p) => p.bucket === 'REACH').length;

  const handleExamChange = (exam: 'JEE_ADVANCED' | 'JEE_MAIN') => {
    onChange({
      ...preferences,
      exam,
      preferredInstituteTypes: exam === 'JEE_ADVANCED' ? ['IIT'] : ['NIT', 'IIIT'],
    });
  };

  const toggleInstType = (type: InstituteType) => {
    const current = [...preferences.preferredInstituteTypes];
    const exists = current.includes(type);
    const updated = exists ? current.filter((t) => t !== type) : [...current, type];
    onChange({ ...preferences, preferredInstituteTypes: updated });
  };

  const toggleBranchGroup = (group: BranchGroup) => {
    const current = [...preferences.preferredBranchGroups];
    const exists = current.includes(group);
    const updated = exists ? current.filter((g) => g !== group) : [...current, group];
    onChange({ ...preferences, preferredBranchGroups: updated });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 mb-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>Counselling Parameters</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure your exact exam score, domicile, and quota to calculate authentic JoSAA probabilities.
          </p>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center space-x-2">
            <span className="text-slate-400">Total Viable:</span>
            <span className="text-white font-bold">{predictions.length}</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Safe: {safeCount}</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Likely: {likelyCount}</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Target: {targetCount}</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-300 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span>Reach: {reachCount}</span>
          </div>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* Exam Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Target Exam
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-exam-jee-adv"
              onClick={() => handleExamChange('JEE_ADVANCED')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition text-center ${
                preferences.exam === 'JEE_ADVANCED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-inner'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
              }`}
            >
              JEE Advanced (IITs)
            </button>
            <button
              type="button"
              id="btn-exam-jee-main"
              onClick={() => handleExamChange('JEE_MAIN')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition text-center ${
                preferences.exam === 'JEE_MAIN'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-inner'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
              }`}
            >
              JEE Main (NITs/IIITs)
            </button>
          </div>
        </div>

        {/* CRL Rank Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            All India Rank (CRL)
          </label>
          <div className="relative">
            <input
              type="number"
              id="input-crl-rank"
              min={1}
              max={500000}
              value={preferences.crlRank}
              onChange={(e) =>
                onChange({ ...preferences, crlRank: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. 4500"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">AIR</span>
          </div>
        </div>

        {/* Category & Category Rank */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Category &amp; Quota Rank
          </label>
          <div className="flex gap-2">
            <select
              id="select-category"
              value={preferences.category}
              onChange={(e) =>
                onChange({ ...preferences, category: e.target.value as Category })
              }
              className="w-1/2 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="OPEN">OPEN (Gen)</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="GEN-EWS">GEN-EWS</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>

            <input
              type="number"
              id="input-category-rank"
              disabled={preferences.category === 'OPEN'}
              value={preferences.category === 'OPEN' ? '' : preferences.categoryRank || ''}
              onChange={(e) =>
                onChange({
                  ...preferences,
                  categoryRank: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder={preferences.category === 'OPEN' ? 'N/A' : 'Cat Rank'}
              className={`w-1/2 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                preferences.category === 'OPEN' ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        {/* Gender & Home State */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Gender Pool &amp; Domicile
          </label>
          <div className="flex gap-2">
            <select
              id="select-gender"
              value={preferences.gender}
              onChange={(e) =>
                onChange({ ...preferences, gender: e.target.value as Gender })
              }
              className="w-1/2 bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Gender-Neutral">Gender-Neutral</option>
              <option value="Female-only">Female-only (+20%)</option>
            </select>

            <select
              id="select-home-state"
              value={preferences.homeState}
              onChange={(e) => onChange({ ...preferences, homeState: e.target.value })}
              className="w-1/2 bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Institute Types */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
          <span className="text-xs text-slate-400 font-medium flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1 text-slate-500" /> Institutes:
          </span>
          {INSTITUTE_OPTIONS.map((item) => {
            const isSelected = preferences.preferredInstituteTypes.includes(item.type);
            const isRelevant =
              preferences.exam === 'JEE_ADVANCED' ? item.type === 'IIT' : item.type !== 'IIT';

            return (
              <button
                key={item.type}
                id={`chip-inst-${item.type.toLowerCase()}`}
                type="button"
                onClick={() => toggleInstType(item.type)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
                } ${!isRelevant ? 'opacity-50' : ''}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Priority Weighting */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Ordering Preference:</span>
          <select
            id="select-priority-weight"
            value={preferences.priorityWeight}
            onChange={(e) =>
              onChange({
                ...preferences,
                priorityWeight: e.target.value as UserPreferences['priorityWeight'],
              })
            }
            className="bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="BALANCED">Balanced (Prestige + Branch)</option>
            <option value="BRANCH_FIRST">Branch-First (CS/AI/ECE First)</option>
            <option value="INSTITUTE_FIRST">Institute-First (Tier-1 Brand)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
