import { useState, useMemo } from 'react';
import { UserPreferences, PredictionResult, ChoiceItem } from './types/counselling';
import { predictForStudent } from './engine/statisticalModel';
import { generateOptimizedChoiceList } from './engine/choiceOptimizer';
import { Header, ActiveTab, PRESET_PROFILES } from './components/Header';
import { RankInputPanel } from './components/RankInputPanel';
import { RankPredictorView } from './components/RankPredictorView';
import { ChoiceOptimizerView } from './components/ChoiceOptimizerView';
import { RoundSimulatorView } from './components/RoundSimulatorView';
import { TrendIntelligenceView } from './components/TrendIntelligenceView';
import { ScenarioComparisonView } from './components/ScenarioComparisonView';
import { TransparencyView } from './components/TransparencyView';
import { AdminPanelView } from './components/AdminPanelView';
import { DemoScriptModal } from './components/DemoScriptModal';
import { ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('predictor');
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Initialize with Aarav Sharma's realistic JEE Advanced profile
  const [preferences, setPreferences] = useState<UserPreferences>(PRESET_PROFILES[0].prefs);

  // Reactive predictions computation
  const predictions = useMemo(() => {
    return predictForStudent(preferences);
  }, [preferences]);

  // Choice list state: initialize with auto-optimized list
  const [choiceList, setChoiceList] = useState<ChoiceItem[]>(() => {
    const initialPreds = predictForStudent(PRESET_PROFILES[0].prefs);
    return generateOptimizedChoiceList(initialPreds, PRESET_PROFILES[0].prefs).orderedChoices;
  });

  const handleSelectPreset = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    const newPreds = predictForStudent(newPrefs);
    const optimized = generateOptimizedChoiceList(newPreds, newPrefs);
    setChoiceList(optimized.orderedChoices);
  };

  const handleAddToChoiceList = (prediction: PredictionResult) => {
    if (choiceList.some((c) => c.prediction.id === prediction.id)) return;

    const newItem: ChoiceItem = {
      id: `choice-${prediction.id}-${Date.now()}`,
      preferenceNumber: choiceList.length + 1,
      prediction,
      userNotes: `Manually added at position #${choiceList.length + 1}.`,
    };

    setChoiceList((prev) => [...prev, newItem]);
  };

  const handleRemoveFromChoiceList = (predictionId: string) => {
    setChoiceList((prev) => {
      const filtered = prev.filter((c) => c.prediction.id !== predictionId);
      return filtered.map((c, idx) => ({ ...c, preferenceNumber: idx + 1 }));
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectPreset={handleSelectPreset}
        onOpenDemo={() => setIsDemoOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Render RankInputPanel for Predictor & Optimizer tabs */}
        {(activeTab === 'predictor' || activeTab === 'optimizer') && (
          <RankInputPanel
            preferences={preferences}
            onChange={setPreferences}
            predictions={predictions}
          />
        )}

        {/* Tab Views */}
        {activeTab === 'predictor' && (
          <RankPredictorView
            predictions={predictions}
            choiceList={choiceList}
            onAddToChoiceList={handleAddToChoiceList}
            onRemoveFromChoiceList={handleRemoveFromChoiceList}
          />
        )}

        {activeTab === 'optimizer' && (
          <ChoiceOptimizerView
            choiceList={choiceList}
            setChoiceList={setChoiceList}
            predictions={predictions}
            preferences={preferences}
            onPreferencesChange={setPreferences}
          />
        )}

        {activeTab === 'simulator' && <RoundSimulatorView choiceList={choiceList} />}

        {activeTab === 'trends' && <TrendIntelligenceView />}

        {activeTab === 'scenarios' && (
          <ScenarioComparisonView
            preferences={preferences}
            basePredictions={predictions}
          />
        )}

        {activeTab === 'transparency' && <TransparencyView />}

        {activeTab === 'admin' && <AdminPanelView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>RankPath</strong> • 100% Free &amp; Open Counselling Intelligence
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>JoSAA Round 6 Archives (2021–2024)</span>
            <span>•</span>
            <span>Zero Data Brokering</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>Made for Aspirants</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </span>
          </div>
        </div>
      </footer>

      {/* 2-Minute Demo Interactive Modal */}
      <DemoScriptModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}
