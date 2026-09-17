import React, { useState } from 'react';
import { ChoiceItem, RoundSimulationStep } from '../types/counselling';
import { simulateJoSAARounds } from '../engine/roundSimulator';
import {
  ShieldAlert,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface RoundSimulatorViewProps {
  choiceList: ChoiceItem[];
}

export const RoundSimulatorView: React.FC<RoundSimulatorViewProps> = ({ choiceList }) => {
  const [activeRound, setActiveRound] = useState<number>(1);
  const simulationSteps = simulateJoSAARounds(choiceList);

  const currentStep = simulationSteps[activeRound - 1];

  const getActionBadge = (action: RoundSimulationStep['recommendedAction']) => {
    switch (action) {
      case 'FLOAT':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Recommended: FLOAT (Accept &amp; Seek Upgrades)
          </span>
        );
      case 'SLIDE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            Recommended: SLIDE (Upgrade within Same College)
          </span>
        );
      case 'FREEZE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Recommended: FREEZE (Lock &amp; Confirm Seat)
          </span>
        );
    }
  };

  if (choiceList.length === 0) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-12 text-center">
        <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-80" />
        <h3 className="text-base font-semibold text-white">No Choices in Preference List</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Add institutes from the Rank Predictor or use &quot;Auto-Generate Optimal List&quot; in the Choice Optimiser to run the round simulation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Introduction Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>JoSAA Multi-Round Allocation Simulator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulates seat movement across all 6 rounds of centralised counselling. Understand when to Float, Slide, or Freeze.
            </p>
          </div>

          <button
            id="btn-restart-sim"
            onClick={() => setActiveRound(1)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition self-start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Round 1</span>
          </button>
        </div>

        {/* Round Stepper */}
        <div className="mt-6 grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((roundNum) => {
            const step = simulationSteps[roundNum - 1];
            const hasSeat = step?.allocatedChoice !== null;
            const isSelected = activeRound === roundNum;

            return (
              <button
                key={roundNum}
                id={`btn-sim-round-${roundNum}`}
                onClick={() => setActiveRound(roundNum)}
                className={`p-2 sm:p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-800/60 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-400">Round</span>
                <span className="text-base sm:text-xl font-black text-white font-mono">{roundNum}</span>
                <span
                  className={`text-[9px] sm:text-[10px] mt-1 font-semibold px-1.5 py-0.5 rounded ${
                    hasSeat
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-700/50 text-slate-400'
                  }`}
                >
                  {hasSeat ? `Choice #${step?.allocatedRankNumber}` : 'Waiting'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Round Inspection Dashboard */}
      {currentStep && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Allocation Card (Cols 1-7) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Seat Allocation Status — Round {currentStep.round}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {currentStep.round === 6 ? 'Final Closing Round' : `Round ${currentStep.round} of 6`}
              </span>
            </div>

            {currentStep.allocatedChoice ? (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                      Allotted Choice #{currentStep.allocatedRankNumber}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {currentStep.allocatedChoice.prediction.institute.name}
                    </h3>
                    <p className="text-sm font-semibold text-emerald-300">
                      {currentStep.allocatedChoice.prediction.branch.name} ({currentStep.allocatedChoice.prediction.branch.degree})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Simulated Cutoff</span>
                    <span className="text-white font-mono font-bold text-sm">
                      ~{currentStep.cutoffInThisRound.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Quota:</span>
                    <span className="font-semibold">{currentStep.allocatedChoice.prediction.quota}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Category:</span>
                    <span className="font-semibold">{currentStep.allocatedChoice.prediction.category}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-8 text-center">
                <p className="text-sm font-semibold text-slate-300">No Seat Allotted in Round {currentStep.round}</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Round 1 cutoffs are historically the most conservative. Vacancies created by dual-admissions open significant movement in subsequent rounds.
                </p>
              </div>
            )}

            {/* Strategic Float/Slide/Freeze Decision Box */}
            <div className="pt-2">
              <div className="mb-2">{getActionBadge(currentStep.recommendedAction)}</div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-200 leading-relaxed">
                <strong className="text-white block mb-1">Tactical Decision Rationale:</strong>
                {currentStep.actionExplanation}
              </div>
            </div>

            {/* Next Round Action buttons */}
            {activeRound < 6 && (
              <div className="pt-2 flex justify-end">
                <button
                  id="btn-next-round"
                  onClick={() => setActiveRound((prev) => Math.min(6, prev + 1))}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center space-x-2 transition"
                >
                  <span>Proceed to Round {activeRound + 1}</span>
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Educational Cheat Sheet (Cols 8-12) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>JoSAA Decision Rules: Float vs Slide vs Freeze</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-slate-300">
                <strong className="text-cyan-300 font-bold block mb-0.5">FLOAT:</strong>
                You accept the current seat and pay the acceptance fee, but elect to be considered for <em>any higher preference</em> across all institutes in later rounds.
                <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
                  Zero risk: Your current seat is 100% secured and cannot be lost.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-slate-300">
                <strong className="text-purple-300 font-bold block mb-0.5">SLIDE:</strong>
                You accept the seat, but will only accept upgrades to a higher branch within the <em>exact same institute</em>.
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-slate-300">
                <strong className="text-emerald-300 font-bold block mb-0.5">FREEZE:</strong>
                You permanently accept the allotted seat and exit the counselling process. You cannot participate in subsequent rounds for upgrades.
                <p className="text-[11px] text-amber-300 mt-1 font-semibold">
                  Warning: Never Freeze before Round 6 unless you have achieved your #1 dream choice!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
