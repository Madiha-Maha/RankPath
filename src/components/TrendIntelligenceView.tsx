import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CUTOFF_DATABASE, INSTITUTES, BRANCHES } from '../data/josaaDatabase';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Sparkles,
  Zap,
} from 'lucide-react';

export const TrendIntelligenceView: React.FC = () => {
  const [selectedInstId, setSelectedInstId] = useState<string>('iit-bombay');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('cse');

  const selectedInst = INSTITUTES.find((i) => i.id === selectedInstId);
  const selectedBranch = BRANCHES.find((b) => b.id === selectedBranchId);

  // Find relevant cutoff entry
  const entry = CUTOFF_DATABASE.find(
    (c) =>
      c.instituteId === selectedInstId &&
      c.branchId === selectedBranchId &&
      c.category === 'OPEN' &&
      c.gender === 'Gender-Neutral'
  );

  const chartData = entry
    ? entry.history.map((h) => ({
        year: `${h.year}`,
        closingRank: h.closingRank,
        openingRank: h.openingRank,
      }))
    : [];

  // Branch trend metrics across database
  const risingBranches = [
    {
      name: 'Artificial Intelligence & Data Science',
      shift: '-22.4%',
      desc: 'Massive surge in student demand across IITs & NITs; cutoffs tightened by ~22% since 2021.',
    },
    {
      name: 'Mathematics and Computing (MnC)',
      shift: '-14.8%',
      desc: 'Top choice for quantitative finance and high-frequency trading recruiters.',
    },
    {
      name: 'Electronics & VLSI / Embedded Systems',
      shift: '-8.6%',
      desc: 'Semiconductor initiatives driving heightened closing ranks in Tier-1 institutes.',
    },
  ];

  const fallingBranches = [
    {
      name: 'Civil Engineering',
      shift: '+28.5%',
      desc: 'Closing ranks relaxed by ~28% as tech career preferences shift student demand.',
    },
    {
      name: 'Chemical Engineering',
      shift: '+18.2%',
      desc: 'Cutoffs relaxed across older IITs and premier NITs.',
    },
    {
      name: 'Mechanical Engineering (Non-Automation)',
      shift: '+14.1%',
      desc: 'Slight easing in closing rank thresholds over 4 years.',
    },
  ];

  // Specific anomalies in JoSAA 2024
  const anomalies = [
    {
      title: 'IIT Kharagpur AI & Data Science Introduction',
      detail: 'Launched specialized B.Tech program in 2023 with 45 seats. Cutoffs stabilized at AIR 540.',
      badge: 'Seat Matrix Expansion',
    },
    {
      title: 'NIT Calicut Computer Science Reallocation',
      detail: 'Added supernumerary female quota seats, expanding overall branch intake by 12%.',
      badge: 'Gender Policy Buffer',
    },
    {
      title: 'IIIT Delhi High Cutoff Elasticity',
      detail: 'Volatile closing rank range (±1,200 ranks) due to JAC Delhi vs JoSAA concurrent counselling.',
      badge: 'Counselling Interplay',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Multi-Year JoSAA Cutoff Trend Intelligence</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical Round 6 closing rank movements from 2021 through 2024. Understand branch demand shifts and seat matrix changes.
            </p>
          </div>
        </div>

        {/* Institute and Branch Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Select Institute
            </label>
            <select
              id="select-trend-institute"
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {INSTITUTES.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Select Branch
            </label>
            <select
              id="select-trend-branch"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.degree})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Trend Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              {selectedInst?.shortName} — {selectedBranch?.name}
            </h3>
            <p className="text-xs text-slate-400">
              OPEN Category • Gender-Neutral • Round 6 Final Cutoff
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
            Note: Lower Rank = Harder Cutoff
          </span>
        </div>

        {chartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  domain={['dataMin - 50', 'dataMax + 50']}
                  reversed={true} // In ranks, lower numbers are better
                  tickFormatter={(val) => val.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                  }}
                  formatter={(val: number | undefined) => [
                    val !== undefined ? `AIR ${val.toLocaleString()}` : 'N/A',
                    'Closing Rank',
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Line
                  type="monotone"
                  dataKey="closingRank"
                  name="Round 6 Closing Rank"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: '#10b981' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="openingRank"
                  name="Round 1 Opening Rank"
                  stroke="#06b6d4"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
            No specific historical data points found for this combination.
          </div>
        )}
      </div>

      {/* Rising vs Falling Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rising Branches */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-3">
            <TrendingUp className="w-4 h-4" />
            <span>Surging Branches (Cutoffs Tightening)</span>
          </div>
          <div className="space-y-3">
            {risingBranches.map((item, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{item.name}</span>
                  <span className="text-xs font-mono font-bold text-rose-400">{item.shift}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Softening Branches */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-sm mb-3">
            <TrendingDown className="w-4 h-4" />
            <span>Softening Branches (Cutoffs Relaxing)</span>
          </div>
          <div className="space-y-3">
            {fallingBranches.map((item, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{item.name}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{item.shift}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anomalies Detected */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>JoSAA Seat Matrix &amp; Cutoff Anomalies</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {anomalies.map((anom, idx) => (
            <div key={idx} className="bg-slate-800/40 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {anom.badge}
              </span>
              <h4 className="text-xs font-semibold text-white mt-1">{anom.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{anom.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
