import React, { useState } from 'react';
import {
  ChoiceItem,
  UserPreferences,
  PredictionResult,
} from '../types/counselling';
import {
  generateOptimizedChoiceList,
  analyzeChoiceListRisks,
  generateJoSAACSV,
} from '../engine/choiceOptimizer';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  Printer,
  Wand2,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Undo,
} from 'lucide-react';

interface ChoiceOptimizerViewProps {
  choiceList: ChoiceItem[];
  setChoiceList: React.Dispatch<React.SetStateAction<ChoiceItem[]>>;
  predictions: PredictionResult[];
  preferences: UserPreferences;
  onPreferencesChange: (newPrefs: UserPreferences) => void;
}

export const ChoiceOptimizerView: React.FC<ChoiceOptimizerViewProps> = ({
  choiceList,
  setChoiceList,
  predictions,
  preferences,
  onPreferencesChange,
}) => {
  const [historyStack, setHistoryStack] = useState<ChoiceItem[][]>([]);
  const [expandedRationaleId, setExpandedRationaleId] = useState<string | null>(null);

  // Analyze risks for the current user list
  const riskAnalysis = analyzeChoiceListRisks(choiceList);

  const saveToHistory = () => {
    setHistoryStack((prev) => [...prev.slice(-10), [...choiceList]]);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    setChoiceList(previous);
  };

  // 1-Click Auto-Optimiser
  const handleAutoOptimize = () => {
    saveToHistory();
    const result = generateOptimizedChoiceList(predictions, preferences);
    setChoiceList(result.orderedChoices);
  };

  const moveChoice = (index: number, direction: 'UP' | 'DOWN') => {
    if (direction === 'UP' && index === 0) return;
    if (direction === 'DOWN' && index === choiceList.length - 1) return;

    saveToHistory();
    const newList = [...choiceList];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    // Recalculate preference order numbers
    const updated = newList.map((item, idx) => ({
      ...item,
      preferenceNumber: idx + 1,
    }));

    setChoiceList(updated);
  };

  const removeChoice = (index: number) => {
    saveToHistory();
    const newList = choiceList.filter((_, i) => i !== index);
    const updated = newList.map((item, idx) => ({
      ...item,
      preferenceNumber: idx + 1,
    }));
    setChoiceList(updated);
  };

  const handleExportCSV = () => {
    const csvContent = generateJoSAACSV(choiceList);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RankPath_JoSAA_ChoiceList_${preferences.crlRank}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Control Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Choice List Optimiser &amp; Sequencer
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                JoSAA Algorithm
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              In JoSAA, once a seat is allotted, all choices below it are permanently deleted.
              Our mathematical engine orders your choices to guarantee dream options are never blocked by early backups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {historyStack.length > 0 && (
              <button
                id="btn-undo-choice-list"
                onClick={handleUndo}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-700"
              >
                <Undo className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
            )}

            <button
              id="btn-auto-optimize"
              onClick={handleAutoOptimize}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-500/20"
            >
              <Wand2 className="w-4 h-4" />
              <span>Auto-Generate Optimal List</span>
            </button>

            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              disabled={choiceList.length === 0}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-700 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>JoSAA CSV</span>
            </button>

            <button
              id="btn-print-pdf"
              onClick={handlePrint}
              disabled={choiceList.length === 0}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-700 disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Live Risk Analysis Banner */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          {riskAnalysis.warnings.length > 0 ? (
            <div className="space-y-2">
              {riskAnalysis.warnings.map((warn, i) => (
                <div
                  key={i}
                  className={`text-xs p-3 rounded-lg border flex items-start space-x-2.5 ${
                    riskAnalysis.hasCriticalHazard
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                  <span className="leading-relaxed">{warn}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>Mathematically Sound:</strong> Your choice list is properly structured. Ambitious reach options sit on top, supported by safe backups below.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Choice List Table / Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-white">Your Official Preference Order</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {choiceList.length} Choices
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Higher number = Higher priority in JoSAA allocation
          </span>
        </div>

        {choiceList.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-400 mb-4">Your choice list is currently empty.</p>
            <button
              onClick={handleAutoOptimize}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
            >
              Click here to Auto-Generate from your Rank
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {choiceList.map((item, idx) => {
              const p = item.prediction;
              const isExpanded = expandedRationaleId === item.id;

              return (
                <div
                  key={item.id}
                  id={`choice-row-${item.preferenceNumber}`}
                  className="p-3.5 sm:p-4 hover:bg-slate-800/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Left: Position Badge & Program Info */}
                  <div className="flex items-start sm:items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm flex-shrink-0 shadow-inner">
                      {item.preferenceNumber}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-semibold text-white text-sm">
                          {p.institute.name}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {p.institute.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          NIRF #{p.institute.nirfRank}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-slate-300 mt-0.5">
                        <span className="text-emerald-300 font-medium">{p.branch.name}</span>
                        <span className="text-slate-400">({p.branch.degree})</span>
                        <span className="text-slate-400 text-[11px]">| Quota: {p.quota}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Probability & Reordering Controls */}
                  <div className="flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                    {/* Bucket badge & prob */}
                    <div className="text-right">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            p.bucket === 'SAFE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : p.bucket === 'LIKELY'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : p.bucket === 'TARGET'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          }`}
                        >
                          {p.bucket}
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          {p.admissionProbability}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Cutoff: ~{p.predictedClosingRank.toLocaleString()}
                      </span>
                    </div>

                    {/* Explanatory Rationale Toggle */}
                    <button
                      id={`btn-rationale-${item.id}`}
                      onClick={() => setExpandedRationaleId(isExpanded ? null : item.id)}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                      title="Why is this choice at this position?"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>

                    {/* Reordering Controls */}
                    <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
                      <button
                        id={`btn-move-up-${item.preferenceNumber}`}
                        disabled={idx === 0}
                        onClick={() => moveChoice(idx, 'UP')}
                        className="p-1 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`btn-move-down-${item.preferenceNumber}`}
                        disabled={idx === choiceList.length - 1}
                        onClick={() => moveChoice(idx, 'DOWN')}
                        className="p-1 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`btn-delete-${item.preferenceNumber}`}
                        onClick={() => removeChoice(idx)}
                        className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Rationale Box */}
                  {isExpanded && (
                    <div className="w-full mt-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                      <strong className="text-emerald-400 font-semibold block mb-1">
                        Placement Logic for Position #{item.preferenceNumber}:
                      </strong>
                      <p className="mb-2">{item.userNotes || p.explanation}</p>
                      <p className="text-[11px] text-slate-400">
                        Historical Cutoff Variance: ±{p.volatilityStdDev.toLocaleString()} ranks •
                        95% CI: [{p.confidenceInterval[0].toLocaleString()} – {p.confidenceInterval[1].toLocaleString()}]
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
