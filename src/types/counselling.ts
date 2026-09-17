export type InstituteType = 'IIT' | 'NIT' | 'IIIT' | 'GFTI';

export type Category = 'OPEN' | 'GEN-EWS' | 'OBC-NCL' | 'SC' | 'ST';

export type Gender = 'Gender-Neutral' | 'Female-only';

export type Quota = 'AI' | 'HS' | 'OS';

export type BranchGroup = 'CSE' | 'AI_DS' | 'ECE' | 'EE' | 'ME' | 'CE' | 'CHE' | 'AERO' | 'MNC' | 'EP' | 'OTHER';

export interface Institute {
  id: string;
  code: string;
  name: string;
  shortName: string;
  type: InstituteType;
  city: string;
  state: string;
  nirfRank: number;
  tier: 1 | 2 | 3;
  established: number;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  group: BranchGroup;
  degree: string;
  durationYears: number;
}

export interface HistoricalPoint {
  year: number;
  round: number;
  openingRank: number;
  closingRank: number;
  seats?: number;
}

export interface CutoffEntry {
  id: string;
  instituteId: string;
  branchId: string;
  quota: Quota;
  category: Category;
  gender: Gender;
  history: HistoricalPoint[]; // sorted by year ascending
  hasNewSeats2024?: boolean;
  notes?: string;
}

export type ProbabilityBucket = 'SAFE' | 'LIKELY' | 'TARGET' | 'REACH' | 'OUT_OF_RANGE';

export interface PredictionResult {
  id: string;
  cutoffEntryId: string;
  institute: Institute;
  branch: Branch;
  quota: Quota;
  category: Category;
  gender: Gender;
  studentRankUsed: number; // CRL or Category rank
  isCategoryRank: boolean;
  predictedClosingRank: number;
  confidenceInterval: [number, number]; // [lowerBound, upperBound] 95%
  admissionProbability: number; // 0 to 100
  bucket: ProbabilityBucket;
  trendSlopePercent: number; // e.g. -2.4% (tightening) or +3.1% (relaxing)
  trendDirection: 'tightening' | 'relaxing' | 'stable';
  volatilityStdDev: number;
  historicalRanks: { year: number; closingRank: number; openingRank: number }[];
  explanation: string;
  dataPointsCount: number;
  anomalyFlag?: string;
  compositeScore: number; // For sorting best overall choice
}

export interface ChoiceItem {
  id: string;
  preferenceNumber: number;
  prediction: PredictionResult;
  userNotes?: string;
  riskWarning?: string;
}

export interface UserPreferences {
  exam: 'JEE_ADVANCED' | 'JEE_MAIN';
  crlRank: number;
  categoryRank?: number;
  category: Category;
  gender: Gender;
  homeState: string;
  preferredInstituteTypes: InstituteType[];
  preferredBranchGroups: BranchGroup[];
  priorityWeight: 'BALANCED' | 'BRANCH_FIRST' | 'INSTITUTE_FIRST' | 'SAFE_FIRST';
}

export interface RoundSimulationStep {
  round: number;
  allocatedChoice: ChoiceItem | null;
  allocatedRankNumber: number | null;
  cutoffInThisRound: number;
  upgradeProbability: number;
  recommendedAction: 'FLOAT' | 'SLIDE' | 'FREEZE';
  actionExplanation: string;
  alternativeChoicesEligible: number;
}

export interface BacktestMetric {
  year: number;
  sampleSize: number;
  overallAccuracyRate: number; // % that fell in predicted 95% CI
  safeBucketSuccessRate: number; // >85% bucket actual admission rate
  likelyBucketSuccessRate: number;
  targetBucketSuccessRate: number;
  reachBucketSuccessRate: number;
  mape: number; // Mean Absolute Percentage Error
}
