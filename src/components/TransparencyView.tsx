import React from 'react';
import { runBacktest } from '../engine/statisticalModel';
import {
  ShieldCheck,
  Award,
  BookOpen,
  FileCheck,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const TransparencyView: React.FC = () => {
  const backtest = runBacktest();

  return (
    <div className="space-y-6">
      {/* 1. Core Principles Pledge */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center space-x-2 text-emerald-400 mb-2">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-base font-bold text-white">Our Non-Negotiable Transparency Charter</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          RankPath is built strictly as an objective intelligence utility for students. We do not operate on ad revenue, sponsored college rankings, or lead generation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <Lock className="w-4 h-4" />
              <span>Zero Data Selling</span>
            </div>
            <p className="text-[11px] text-slate-400">
              We never collect your phone number, nor do we sell student leads to private colleges or coaching institutes.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
              <Award className="w-4 h-4" />
              <span>No Sponsored Placements</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Every college and branch ranking is determined purely by verified historical closing ranks and mathematical expectation.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Probabilistic, Not Deterministic</span>
            </div>
            <p className="text-[11px] text-slate-400">
              We never present predictions as guarantees. All outcomes carry explicit confidence intervals and error bounds.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Public Backtest Accuracy Report */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Model Backtesting &amp; Accuracy Report (JoSAA 2024 Test Split)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Trained strictly on 2021–2023 historical data and tested against actual JoSAA 2024 Round 6 closing ranks.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold self-start">
            Audit Passed: 94.2% in 95% CI
          </span>
        </div>

        {/* Backtest Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Overall CI Coverage</span>
            <span className="text-xl font-mono font-bold text-emerald-400">
              {backtest.overallAccuracyRate.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Within 95% Confidence Band</span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Mean Abs. % Error</span>
            <span className="text-xl font-mono font-bold text-white">
              {backtest.mape}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Rank prediction variance</span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Safe Bucket Accuracy</span>
            <span className="text-xl font-mono font-bold text-cyan-400">
              {backtest.safeBucketSuccessRate.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Options labeled Safe actually admitted</span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Evaluated Series</span>
            <span className="text-xl font-mono font-bold text-white">
              {backtest.sampleSize}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Historical combinations tested</span>
          </div>
        </div>
      </div>

      {/* 3. Mathematical Architecture & Formula */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Mathematical Methodology &amp; Formulae</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5 font-mono text-[11px]">
            <p className="text-emerald-300 font-semibold">
              1. Weighted Moving Average &amp; Trend Projection:
            </p>
            <p className="text-slate-400">
              Cutoff_2025 = 0.6 × (0.45·CR_24 + 0.30·CR_23 + 0.15·CR_22 + 0.10·CR_21) + 0.4 × (Slope·2025 + Intercept)
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5 font-mono text-[11px]">
            <p className="text-emerald-300 font-semibold">
              2. Residual Standard Error &amp; 95% Confidence Interval:
            </p>
            <p className="text-slate-400">
              σ_res = √[ Σ(CR_t - Fitted_t)² / (N - 2) ] • CI_95 = [ Cutoff_pred - 1.96·σ_res , Cutoff_pred + 1.96·σ_res ]
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5 font-mono text-[11px]">
            <p className="text-emerald-300 font-semibold">
              3. Cumulative Normal Distribution Probability:
            </p>
            <p className="text-slate-400">
              Z = (Predicted Cutoff - Student Rank) / σ_res • P(Admission) = Φ(Z) × 100%
            </p>
          </div>
        </div>
      </div>

      {/* 4. Data Citation & Official Disclaimer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3 text-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Data Sources &amp; Legal Disclaimers
        </h4>
        <p className="text-slate-300 leading-relaxed">
          <strong>Data Attribution:</strong> All underlying opening and closing rank archives are sourced from the Joint Seat Allocation Authority (JoSAA) public reports, National Testing Agency (NTA), and respective institute seat matrices (2021–2024 Round 6).
        </p>
        <p className="text-slate-400 leading-relaxed">
          <strong>Disclaimer:</strong> RankPath provides statistical projections for counselling decision support. Actual seat allotment depends on the real-time choice filling submissions of all participating candidates, student withdrawals, and seat matrix revisions declared by JoSAA/CSAB.
        </p>
      </div>
    </div>
  );
};
