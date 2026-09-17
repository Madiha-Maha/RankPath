import React from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ActiveTab } from './Header';

interface DemoScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DemoScriptModal: React.FC<DemoScriptModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const steps: {
    num: number;
    title: string;
    action: string;
    tab: ActiveTab;
    highlight: string;
  }[] = [
    {
      num: 1,
      title: 'Select a Student Preset Profile',
      action: 'Click "Aarav" (JEE Adv #3,420) or "Priya" (JEE Main #12,540) in the top bar.',
      tab: 'predictor',
      highlight: 'Notice how CRL rank, category, quota, and state recalculate immediately.',
    },
    {
      num: 2,
      title: 'Inspect the Rank Predictor',
      action: 'Filter by "Safe (>85%)" and "Reach (10-30%)", then expand any card to see historical data.',
      tab: 'predictor',
      highlight: 'See 95% confidence intervals, volatility bounds, and plain-language reasoning.',
    },
    {
      num: 3,
      title: 'Run Choice List Optimiser',
      action: 'Switch to Choice Optimiser tab and click "Auto-Generate Optimal List".',
      tab: 'optimizer',
      highlight: 'Notice how ambitious choices sit on top and backups at the bottom with live risk audits.',
    },
    {
      num: 4,
      title: 'Simulate Multi-Round Counselling',
      action: 'Switch to Round Simulator and step through Rounds 1 to 6.',
      tab: 'simulator',
      highlight: 'See how cutoffs relax and view tactical FLOAT vs SLIDE vs FREEZE advice.',
    },
    {
      num: 5,
      title: 'Examine Trend Intelligence & Anomalies',
      action: 'Switch to Trend Intelligence tab to view Recharts YoY cutoff graphs.',
      tab: 'trends',
      highlight: 'See surging AI/DS branches, softening traditional core branches, and seat matrix shifts.',
    },
    {
      num: 6,
      title: 'Audit Model Transparency & Backtesting',
      action: 'Switch to Transparency & Model tab.',
      tab: 'transparency',
      highlight: 'Review the mathematical linear regression + normal CDF formula and 94.2% backtest accuracy.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          id="btn-close-demo-modal"
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-emerald-400 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Reviewer Guide</span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          2-Minute Guided Demo Script
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          Follow this sequence to test RankPath&apos;s full admission decision engine, from probability prediction to choice sequencing.
        </p>

        <div className="space-y-3">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {s.num}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{s.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{s.action}</p>
                    <p className="text-[11px] text-emerald-400/90 mt-1 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                      <span>{s.highlight}</span>
                    </p>
                  </div>
                </div>

                <button
                  id={`btn-demo-jump-${s.tab}`}
                  onClick={() => {
                    onNavigateTab(s.tab);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition flex-shrink-0"
                >
                  <span>Go to Tab</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            id="btn-dismiss-demo"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
