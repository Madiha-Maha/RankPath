import { PredictionResult, ChoiceItem, UserPreferences } from '../types/counselling';

export interface ChoiceOptimizationResult {
  orderedChoices: ChoiceItem[];
  riskWarnings: string[];
  expectedSeatValueScore: number; // 0 to 100
  safetyMarginScore: number; // 0 to 100
  reachCount: number;
  targetCount: number;
  likelyCount: number;
  safeCount: number;
  strategySummary: string;
}

export function generateOptimizedChoiceList(
  predictions: PredictionResult[],
  preferences: UserPreferences
): ChoiceOptimizationResult {
  // Deduplicate combinations by institute + branch + quota, picking highest probability
  const programMap = new Map<string, PredictionResult>();
  for (const p of predictions) {
    const key = `${p.institute.id}-${p.branch.id}-${p.quota}`;
    const existing = programMap.get(key);
    if (!existing || p.admissionProbability > existing.admissionProbability) {
      programMap.set(key, p);
    }
  }
  const deduplicated = Array.from(programMap.values());

  // Filter only viable options (exclude completely out of range <10%)
  let viable = deduplicated.filter((p) => p.bucket !== 'OUT_OF_RANGE');
  if (viable.length === 0 && deduplicated.length > 0) {
    viable = [...deduplicated]
      .sort((a, b) => b.admissionProbability - a.admissionProbability)
      .slice(0, 10);
  }

  // Group by buckets
  const reach = viable.filter((p) => p.bucket === 'REACH');
  const target = viable.filter((p) => p.bucket === 'TARGET');
  const likely = viable.filter((p) => p.bucket === 'LIKELY');
  const safe = viable.filter((p) => p.bucket === 'SAFE');

  // Sorting comparator inside each bucket depending on user strategy
  const sortComparator = (a: PredictionResult, b: PredictionResult) => {
    if (preferences.priorityWeight === 'BRANCH_FIRST') {
      // Prioritize CSE / AI_DS / MNC first
      const branchScore = (p: PredictionResult) =>
        ['CSE', 'AI_DS', 'MNC'].includes(p.branch.group)
          ? 300
          : ['ECE', 'EE'].includes(p.branch.group)
          ? 200
          : 100;
      return branchScore(b) - branchScore(a) || b.institute.nirfRank - a.institute.nirfRank;
    } else if (preferences.priorityWeight === 'INSTITUTE_FIRST') {
      // Prioritize Top NIRF / Tier 1 Institutes
      return a.institute.nirfRank - b.institute.nirfRank || b.compositeScore - a.compositeScore;
    } else {
      // BALANCED: Composite score
      return b.compositeScore - a.compositeScore;
    }
  };

  reach.sort(sortComparator);
  target.sort(sortComparator);
  likely.sort(sortComparator);
  safe.sort(sortComparator);

  // Golden JoSAA Ordering:
  // Step 1: Ambitious / Dream Choices (Reach, ~20-25% of list)
  // Step 2: Realistic Competitive Choices (Target, ~35-40% of list)
  // Step 3: High-Confidence Upgrades (Likely, ~25-30% of list)
  // Step 4: Concrete Backups (Safe, ~15-20% of list, placed strictly at the bottom)
  const combined: PredictionResult[] = [
    ...reach.slice(0, 10),
    ...target.slice(0, 15),
    ...likely.slice(0, 12),
    ...safe.slice(0, 8),
  ];

  // If none fell into traditional buckets, provide the closest available options
  if (combined.length === 0 && viable.length > 0) {
    combined.push(...viable.slice(0, 10));
  }

  // Map into ChoiceItem with preference numbers and risk audits
  const choices: ChoiceItem[] = combined.map((p, index) => {
    const prefNum = index + 1;
    let rationale = '';

    if (p.bucket === 'REACH') {
      rationale = `Position #${prefNum}: High-aspiration choice. Zero risk to fill at the top; if not allotted, system falls back to choice #${prefNum + 1} automatically.`;
    } else if (p.bucket === 'TARGET') {
      rationale = `Position #${prefNum}: Strong target choice. Maximizes academic outcome without compromising your guaranteed backup seats below.`;
    } else if (p.bucket === 'LIKELY') {
      rationale = `Position #${prefNum}: High-likelihood buffer seat with favorable historical probability (${p.admissionProbability}%).`;
    } else {
      rationale = `Position #${prefNum}: Crucial safety net (${p.admissionProbability}% certainty). Placed toward the bottom so it never blocks an upgrade to higher choices.`;
    }

    return {
      id: `choice-${p.id}-${prefNum}`,
      preferenceNumber: prefNum,
      prediction: p,
      userNotes: rationale,
    };
  });

  // Evaluate structural risk flags
  const riskAnalysis = analyzeChoiceListRisks(choices);

  // Expected seat value index
  const safeCushion = Math.min(100, safe.length * 25);
  const aspirationCoverage = Math.min(100, (reach.length + target.length) * 12);
  const expectedSeatValueScore = Math.round(0.5 * aspirationCoverage + 0.5 * safeCushion);

  return {
    orderedChoices: choices,
    riskWarnings: riskAnalysis.warnings,
    expectedSeatValueScore,
    safetyMarginScore: safeCushion,
    reachCount: reach.length,
    targetCount: target.length,
    likelyCount: likely.length,
    safeCount: safe.length,
    strategySummary:
      preferences.priorityWeight === 'BRANCH_FIRST'
        ? 'Branch-First Maximizer: Prioritizes premier computing & electronics programs across institutes.'
        : preferences.priorityWeight === 'INSTITUTE_FIRST'
        ? 'Institute-First Strategy: Prioritizes premier Tier-1 brands and campus ecosystems.'
        : 'Balanced Expected-Utility: Optimizes trade-off between institutional prestige and branch curriculum.',
  };
}

// Interactive Choice List Risk Analyzer: Inspects any user-modified ordering
export function analyzeChoiceListRisks(choices: ChoiceItem[]): {
  warnings: string[];
  hasCriticalHazard: boolean;
} {
  const warnings: string[] = [];
  let hasCriticalHazard = false;

  if (choices.length === 0) {
    return { warnings: ['Your choice list is empty. Add institutes to evaluate.'], hasCriticalHazard: true };
  }

  // Check 1: Inverted Safety (Safe choice placed ahead of a Reach/Target choice)
  for (let i = 0; i < choices.length; i++) {
    const current = choices[i];
    if (current.prediction.bucket === 'SAFE') {
      // Look for any reach/target choices placed BELOW this safe choice
      for (let j = i + 1; j < choices.length; j++) {
        const below = choices[j];
        if (below.prediction.bucket === 'REACH' || below.prediction.bucket === 'TARGET') {
          // Check if below is a higher tier institute or equal branch
          if (below.prediction.institute.tier <= current.prediction.institute.tier) {
            warnings.push(
              `⚠️ Inverted Ordering Hazard: Choice #${current.preferenceNumber} (${current.prediction.institute.shortName} - ${current.prediction.branch.code}) is a SAFE choice (${current.prediction.admissionProbability}%) placed ABOVE Choice #${below.preferenceNumber} (${below.prediction.institute.shortName} - ${below.prediction.branch.code}), an ambitious choice. In JoSAA, getting allotted choice #${current.preferenceNumber} will permanently cancel choice #${below.preferenceNumber}!`
            );
            hasCriticalHazard = true;
            break;
          }
        }
      }
    }
  }

  // Check 2: Safety Cushion count
  const safeCount = choices.filter((c) => c.prediction.bucket === 'SAFE').length;
  if (safeCount === 0) {
    warnings.push(
      '🚨 Zero Guaranteed Backups: Your list contains no SAFE (>85%) choices. In an unpredictable cutoff year, you face a significant risk of zero seat allocation in JoSAA.'
    );
    hasCriticalHazard = true;
  } else if (safeCount < 2) {
    warnings.push(
      '⚡ Thin Safety Net: You have only 1 SAFE choice. We strongly recommend adding at least 2 to 3 high-probability backups at the bottom of your list.'
    );
  }

  // Check 3: Redundant lower choices
  if (choices.length >= 2) {
    for (let i = 0; i < choices.length - 1; i++) {
      const c1 = choices[i].prediction;
      const c2 = choices[i + 1].prediction;
      if (
        c1.institute.id === c2.institute.id &&
        c1.admissionProbability > 90 &&
        c2.admissionProbability < c1.admissionProbability
      ) {
        warnings.push(
          `Notice: Choice #${i + 2} (${c2.branch.code} at ${c2.institute.shortName}) will almost never be reached because Choice #${i + 1} (${c1.branch.code}) is already ~99% guaranteed.`
        );
      }
    }
  }

  return { warnings, hasCriticalHazard };
}

// Generate CSV conforming to JoSAA portal choice upload schema
export function generateJoSAACSV(choices: ChoiceItem[]): string {
  const headers = [
    'Choice No.',
    'Institute Name',
    'Academic Program Name',
    'Quota',
    'Category',
    'Gender',
    'Predicted Cutoff Rank',
    'Admission Probability',
    'Status',
  ];

  const rows = choices.map((c) => [
    c.preferenceNumber,
    `"${c.prediction.institute.name}"`,
    `"${c.prediction.branch.name} (${c.prediction.branch.degree})"`,
    c.prediction.quota,
    c.prediction.category,
    c.prediction.gender,
    c.prediction.predictedClosingRank,
    `${c.prediction.admissionProbability}%`,
    c.prediction.bucket,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
