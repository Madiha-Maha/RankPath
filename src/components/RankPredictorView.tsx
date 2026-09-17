import React, { useState } from 'react';
import {
  PredictionResult,
  ProbabilityBucket,
  ChoiceItem,
} from '../types/counselling';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Plus,
  Search,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RankPredictorViewProps {
  predictions: PredictionResult[];
  choiceList: ChoiceItem[];
  onAddToChoiceList: (prediction: PredictionResult) => void;
  onRemoveFromChoiceList: (predictionId: string) => void;
}

export const RankPredictorView: React.FC<RankPredictorViewProps> = ({
  predictions,
  choiceList,
  onAddToChoiceList,
  onRemoveFromChoiceList,
}) => {
  const [selectedBucket, setSelectedBucket] = useState<ProbabilityBucket | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Filter predictions
  const filtered = predictions.filter((p) => {
    const matchBucket = selectedBucket === 'ALL' || p.bucket === selectedBucket;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.institute.name.toLowerCase().includes(q) ||
      p.institute.shortName.toLowerCase().includes(q) ||
      p.branch.name.toLowerCase().includes(q) ||
      p.branch.code.toLowerCase().includes(q) ||
      p.institute.city.toLowerCase().includes(q);
    return matchBucket && matchSearch;
  });

  const getBucketBadge = (bucket: ProbabilityBucket) => {
    switch (bucket) {
      case 'SAFE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Safe (&gt;85%)
          </span>
        );
      case 'LIKELY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Likely (60–85%)
          </span>
        );
      case 'TARGET':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Target (30–60%)
          </span>
        );
      case 'REACH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
            Reach (10–30%)
          </span>
        );
      case 'OUT_OF_RANGE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            Out of Range (&lt;10%)
          </span>
        );
    }
  };

  const getProgressBarColor = (bucket: ProbabilityBucket) => {
    switch (bucket) {
      case 'SAFE':
        return 'bg-emerald-500';
      case 'LIKELY':
        return 'bg-cyan-500';
      case 'TARGET':
        return 'bg-amber-500';
      case 'REACH':
        return 'bg-orange-500';
      case 'OUT_OF_RANGE':
        return 'bg-slate-600';
    }
  };

  const isAlreadyInChoices = (id: string) => {
    return choiceList.some((c) => c.prediction.id === id);
  };

  return (
    <div className="space-y-4">
      {/* Search and Bucket Filter Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        {/* Bucket Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto no-scrollbar text-xs">
          {(
            [
              { key: 'ALL', label: 'All Combinations' },
              { key: 'SAFE', label: 'Safe (>85%)' },
              { key: 'LIKELY', label: 'Likely (60-85%)' },
              { key: 'TARGET', label: 'Target (30-60%)' },
              { key: 'REACH', label: 'Reach (10-30%)' },
            ] as const
          ).map((b) => (
            <button
              key={b.key}
              id={`filter-bucket-${b.key.toLowerCase()}`}
              onClick={() => setSelectedBucket(b.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                selectedBucket === b.key
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            id="search-institutes-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search institute, branch, city..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Results Count & Disclaimer Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filtered.length}</strong> matching JoSAA seat options
        </span>
        <span className="hidden sm:inline-flex items-center text-slate-400">
          <Info className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Predictions use multi-year Round 6 final closing ranks (2021–2024)
        </span>
      </div>

      {/* Grid of Prediction Cards */}
      <div className="grid grid-cols-1 gap-3.5">
        {filtered.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-semibold text-white">No matching combinations found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Try adjusting your CRL rank, broadening your branch preferences, or switching between Safe, Likely, and Reach filters.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isAdded = isAlreadyInChoices(item.id);
            const isExpanded = expandedCardId === item.id;

            return (
              <div
                key={item.id}
                id={`card-pred-${item.id}`}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition shadow-lg relative overflow-hidden"
              >
                {/* Top Row: Institute, Branch & Action */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono font-semibold text-slate-300 border border-slate-700">
                        {item.institute.type}
                      </span>
                      <h3 className="text-base font-semibold text-white tracking-tight">
                        {item.institute.name}
                      </h3>
                      <span className="text-xs text-slate-400">
                        ({item.institute.city}, {item.institute.state}) • NIRF #{item.institute.nirfRank}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-slate-200 flex-wrap gap-y-1">
                      <span className="font-semibold text-emerald-300">{item.branch.name}</span>
                      <span className="text-xs text-slate-400">({item.branch.degree})</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        Quota: {item.quota}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 font-mono">
                        {item.category}
                      </span>
                      {item.gender === 'Female-only' && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/30 font-medium">
                          Female-only
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to choice list CTA */}
                  <div className="flex items-center space-x-2 self-start">
                    {isAdded ? (
                      <button
                        id={`btn-remove-choice-${item.id}`}
                        onClick={() => onRemoveFromChoiceList(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center space-x-1.5 hover:bg-emerald-500/30 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>In Choice List</span>
                      </button>
                    ) : (
                      <button
                        id={`btn-add-choice-${item.id}`}
                        onClick={() => onAddToChoiceList(item)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500 text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to List</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Probability & Statistics Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Probability Bar (Col 1-5) */}
                  <div className="lg:col-span-5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        {getBucketBadge(item.bucket)}
                        <span className="text-slate-300 font-mono font-bold text-sm">
                          {item.admissionProbability}%
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        95% CI: [{item.confidenceInterval[0].toLocaleString()} – {item.confidenceInterval[1].toLocaleString()}]
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                      <div
                        className={`h-full ${getProgressBarColor(item.bucket)} transition-all duration-500 rounded-full`}
                        style={{ width: `${Math.max(4, item.admissionProbability)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Key Metrics (Col 6-10) */}
                  <div className="lg:col-span-5 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-800/50 rounded-lg p-1.5 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Predicted Cutoff</span>
                      <span className="text-white font-mono font-bold text-xs">
                        ~{item.predictedClosingRank.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-1.5 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Your Rank</span>
                      <span className="text-emerald-400 font-mono font-bold text-xs">
                        {item.studentRankUsed.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-1.5 border border-slate-800 flex flex-col justify-center items-center">
                      <span className="text-slate-400 block text-[10px] uppercase">YoY Trend</span>
                      <div className="flex items-center space-x-1">
                        {item.trendDirection === 'tightening' ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-rose-400" />
                            <span className="text-rose-400 font-mono font-semibold text-xs">
                              {Math.abs(item.trendSlopePercent)}% Tight
                            </span>
                          </>
                        ) : item.trendDirection === 'relaxing' ? (
                          <>
                            <TrendingDown className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-mono font-semibold text-xs">
                              +{item.trendSlopePercent}% Soft
                            </span>
                          </>
                        ) : (
                          <>
                            <Minus className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-300 font-mono text-xs">Stable</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expand Toggle (Col 11-12) */}
                  <div className="lg:col-span-2 flex justify-end">
                    <button
                      id={`btn-expand-pred-${item.id}`}
                      onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition px-2 py-1 rounded hover:bg-slate-800"
                    >
                      <span>{isExpanded ? 'Hide Data' : 'View History'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Deep Dive Section */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-3 bg-slate-950/50 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 sm:p-5">
                    <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400 font-semibold block mb-1">
                        Prediction Rationale:
                      </strong>
                      {item.explanation}
                    </div>

                    {/* Historical Cutoff Table */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1.5">
                        <span>Historical Round 6 JoSAA Closing Ranks</span>
                        <span className="text-[10px] text-slate-400 font-normal">({item.category} / {item.gender})</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {item.historicalRanks.map((hr) => (
                          <div
                            key={hr.year}
                            className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center"
                          >
                            <span className="text-slate-400 text-[11px] block">{hr.year} Round 6</span>
                            <span className="text-white font-mono font-semibold text-xs">
                              CR: {hr.closingRank.toLocaleString()}
                            </span>
                            <span className="text-slate-400 text-[10px] block">
                              OR: {hr.openingRank.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {item.anomalyFlag && (
                      <div className="text-xs flex items-center space-x-2 text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{item.anomalyFlag}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
