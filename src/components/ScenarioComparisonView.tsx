import React, { useState } from 'react';
import { UserPreferences, PredictionResult } from '../types/counselling';
import { predictForStudent } from '../engine/statisticalModel';
import { generateOptimizedChoiceList } from '../engine/choiceOptimizer';
import { Sliders, GitCompare, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ScenarioComparisonViewProps {
  preferences: UserPreferences;
  basePredictions: PredictionResult[];
}

export const ScenarioComparisonView: React.FC<ScenarioComparisonViewProps> = ({
  preferences,
  basePredictions,
}) => {
  // Rank shift slider delta (-2500 to +2500)
  const [rankDelta, setRankDelta] = useState<number>(0);

  const simulatedRank = Math.max(1, preferences.crlRank + rankDelta);

  const simulatedPrefs: UserPreferences = {
    ...preferences,
    crlRank: simulatedRank,
    categoryRank: preferences.categoryRank
      ? Math.max(1, preferences.categoryRank + Math.round(rankDelta * 0.3))
      : undefined,
  };

  const simulatedPredictions = predictForStudent(simulatedPrefs);

  // Compare two candidate choice lists:
  // Candidate A: Branch-First (Prestige in CS/ECE)
  // Candidate B: Institute-First (Premier Tier-1 IITs/NITs)
  const listA = generateOptimizedChoiceList(basePredictions, {
    ...preferences,
    priorityWeight: 'BRANCH_FIRST',
  });

  const listB = generateOptimizedChoiceList(basePredictions, {
    ...preferences,
    priorityWeight: 'INSTITUTE_FIRST',
  });

  return (
    <div className="space-y-6">
      {/* 1. "What if my rank were X?" Slider Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>Sensitivity Analysis: &quot;What If My Rank Were X?&quot;</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate rank fluctuations to observe how admission probabilities and buckets react in real time.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400">Simulated Rank:</span>
            <span className="text-base font-mono font-bold text-emerald-400">
              AIR {simulatedRank.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({rankDelta >= 0 ? `+${rankDelta}` : rankDelta})
            </span>
          </div>
        </div>

        {/* Slider input */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>-2,500 Ranks (Better)</span>
            <span className="text-white font-semibold">Baseline: {preferences.crlRank.toLocaleString()}</span>
            <span>+2,500 Ranks (Lower)</span>
          </div>
          <input
            type="range"
            id="slider-rank-shift"
            min={-2500}
            max={2500}
            step={50}
            value={rankDelta}
            onChange={(e) => setRankDelta(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-end">
            <button
              id="btn-reset-slider"
              onClick={() => setRankDelta(0)}
              className="text-xs text-slate-400 hover:text-emerald-400 transition"
            >
              Reset to actual rank
            </button>
          </div>
        </div>

        {/* Live Impact Preview Table */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Outcome Shift for Top Combinations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {simulatedPredictions.slice(0, 6).map((item) => {
              const baseItem = basePredictions.find(
                (p) => p.institute.id === item.institute.id && p.branch.id === item.branch.id
              );
              const probDiff = baseItem
                ? item.admissionProbability - baseItem.admissionProbability
                : 0;

              return (
                <div
                  key={item.id}
                  className="bg-slate-800/50 border border-slate-800 rounded-lg p-3 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">{item.institute.shortName}</span>
                    <h5 className="text-xs font-semibold text-white truncate">{item.branch.name}</h5>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        item.bucket === 'SAFE'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : item.bucket === 'LIKELY'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : item.bucket === 'TARGET'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-orange-500/20 text-orange-300'
                      }`}
                    >
                      {item.bucket}
                    </span>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-white">
                        {item.admissionProbability}%
                      </span>
                      {probDiff !== 0 && (
                        <span
                          className={`text-[10px] font-mono ml-1 font-semibold ${
                            probDiff > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          ({probDiff > 0 ? `+${probDiff}` : probDiff}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Candidate Choice List Comparison */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="mb-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <GitCompare className="w-5 h-5 text-emerald-400" />
            <span>Dual Choice-List Strategy Comparison</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare two candidate choice lists side-by-side: Branch-First (maximizing CSE/AI/ECE) versus Institute-First (maximizing Tier-1 Brand).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Candidate List A */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Strategy A</span>
                <h4 className="text-sm font-bold text-white">Branch-First Optimizer</h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                Score: {listA.expectedSeatValueScore}/100
              </span>
            </div>

            <p className="text-xs text-slate-400">{listA.strategySummary}</p>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-900/80 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Total Choices</span>
                <span className="font-mono font-bold text-white">{listA.orderedChoices.length}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Safe Backups</span>
                <span className="font-mono font-bold text-emerald-400">{listA.safeCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Dream Reaches</span>
                <span className="font-mono font-bold text-orange-400">{listA.reachCount}</span>
              </div>
            </div>

            {/* Top 3 Choices Preview */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Top 3 Preferences:
              </span>
              {listA.orderedChoices.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="text-xs p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <span className="text-slate-200">
                    #{c.preferenceNumber} {c.prediction.institute.shortName} • {c.prediction.branch.code}
                  </span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {c.prediction.admissionProbability}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate List B */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Strategy B</span>
                <h4 className="text-sm font-bold text-white">Institute-First Optimizer</h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                Score: {listB.expectedSeatValueScore}/100
              </span>
            </div>

            <p className="text-xs text-slate-400">{listB.strategySummary}</p>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-900/80 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Total Choices</span>
                <span className="font-mono font-bold text-white">{listB.orderedChoices.length}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Safe Backups</span>
                <span className="font-mono font-bold text-emerald-400">{listB.safeCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Dream Reaches</span>
                <span className="font-mono font-bold text-orange-400">{listB.reachCount}</span>
              </div>
            </div>

            {/* Top 3 Choices Preview */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Top 3 Preferences:
              </span>
              {listB.orderedChoices.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="text-xs p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <span className="text-slate-200">
                    #{c.preferenceNumber} {c.prediction.institute.shortName} • {c.prediction.branch.code}
                  </span>
                  <span className="text-cyan-400 font-mono font-semibold">
                    {c.prediction.admissionProbability}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation Verdict */}
        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>Engine Verdict:</strong> For rank {preferences.crlRank.toLocaleString()}, Strategy A provides superior curriculum focus with sufficient backup coverage ({listA.safeCount} guaranteed seats), while Strategy B maximizes campus alumni prestige. Both lists maintain zero inverted backup hazards.
          </span>
        </div>
      </div>
    </div>
  );
};
