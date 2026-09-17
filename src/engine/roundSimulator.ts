import { ChoiceItem, RoundSimulationStep } from '../types/counselling';

export function simulateJoSAARounds(choices: ChoiceItem[]): RoundSimulationStep[] {
  if (choices.length === 0) return [];

  const steps: RoundSimulationStep[] = [];
  const TOTAL_ROUNDS = 6;

  // Track the highest choice currently allocated
  let currentAllocatedIndex = -1; // index in choices array

  // Historical round cutoff expansion factors in JoSAA
  // Round 1 is tightest (~0.88 of Round 6 final closing rank)
  // Round 2 ~0.91
  // Round 3 ~0.94
  // Round 4 ~0.96
  // Round 5 ~0.98
  // Round 6 = 1.00 (Final closing rank)
  const roundMultipliers = [0.88, 0.91, 0.94, 0.96, 0.98, 1.0];

  for (let r = 1; r <= TOTAL_ROUNDS; r++) {
    const multiplier = roundMultipliers[r - 1];

    // Check from choice 0 to choices.length - 1
    // Stop at the first choice that meets the simulated cutoff
    let newlyAllocatedIndex = -1;
    let cutoffForAllocated = 0;

    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i];
      const studentRank = choice.prediction.studentRankUsed;
      // In this round, closing rank is roughly multiplier * final predicted closing rank
      const roundClosingCutoff = Math.round(choice.prediction.predictedClosingRank * multiplier);

      if (studentRank <= roundClosingCutoff) {
        newlyAllocatedIndex = i;
        cutoffForAllocated = roundClosingCutoff;
        break; // First eligible choice in preference order is allocated
      }
    }

    // In JoSAA, you can only upgrade to a higher choice (lower index number)
    if (newlyAllocatedIndex !== -1) {
      if (currentAllocatedIndex === -1 || newlyAllocatedIndex < currentAllocatedIndex) {
        currentAllocatedIndex = newlyAllocatedIndex;
      }
    }

    const allocatedChoice = currentAllocatedIndex !== -1 ? choices[currentAllocatedIndex] : null;

    // Calculate probability of upgrade in the next round
    let upgradeProb = 0;
    if (allocatedChoice && currentAllocatedIndex > 0) {
      // Look at choices above
      const choicesAbove = choices.slice(0, currentAllocatedIndex);
      const avgProbAbove =
        choicesAbove.reduce((acc, c) => acc + c.prediction.admissionProbability, 0) /
        choicesAbove.length;
      const roundsRemaining = TOTAL_ROUNDS - r;
      upgradeProb = Math.min(95, Math.round(avgProbAbove * (roundsRemaining / 5)));
    }

    // Tactical Decision Advice
    let recommendedAction: 'FLOAT' | 'SLIDE' | 'FREEZE' = 'FLOAT';
    let actionExplanation = '';

    if (!allocatedChoice) {
      recommendedAction = 'FLOAT';
      actionExplanation = `Round ${r}: No seat allocated yet because Round ${r} opening cutoffs are strict. Maintain patience; seat withdrawals and dual-acceptance cancellations open seats in Rounds 3–6.`;
    } else if (currentAllocatedIndex === 0) {
      // Allotted choice #1
      recommendedAction = 'FREEZE';
      actionExplanation = `Congratulations! You received your #1 preference (${allocatedChoice.prediction.institute.shortName} - ${allocatedChoice.prediction.branch.name}). There are no higher choices available. Freeze your seat and proceed with document verification.`;
    } else if (r === TOTAL_ROUNDS) {
      recommendedAction = 'FREEZE';
      actionExplanation = `Round 6 is the final JoSAA round. All allocations are automatically frozen. Pay seat acceptance fee and complete online document verification to secure your seat.`;
    } else {
      // Check if same institute has higher branches above
      const higherChoices = choices.slice(0, currentAllocatedIndex);
      const sameInstituteHigher = higherChoices.filter(
        (c) => c.prediction.institute.id === allocatedChoice.prediction.institute.id
      );

      if (upgradeProb >= 40) {
        recommendedAction = 'FLOAT';
        actionExplanation = `Recommended: Choose FLOAT. You have a ${upgradeProb}% likelihood of upgrading to an ambitious choice in subsequent rounds (e.g. ${higherChoices[0].prediction.institute.shortName} ${higherChoices[0].prediction.branch.code}). Your current seat at Choice #${allocatedChoice.preferenceNumber} is 100% reserved and cannot be lost.`;
      } else if (sameInstituteHigher.length > 0 && upgradeProb >= 20) {
        recommendedAction = 'SLIDE';
        actionExplanation = `Recommended: Consider SLIDE or FLOAT. If you strictly prefer remaining at ${allocatedChoice.prediction.institute.shortName} for a better branch (${sameInstituteHigher[0].prediction.branch.code}), choose SLIDE. If open to higher institutes, choose FLOAT. Do NOT freeze.`;
      } else {
        recommendedAction = 'FLOAT';
        actionExplanation = `Recommended: Choose FLOAT. Even though chances of upgrading to choices above are modest (~${upgradeProb}%), selecting FLOAT carries zero downside: you can never lose your currently allocated seat!`;
      }
    }

    steps.push({
      round: r,
      allocatedChoice,
      allocatedRankNumber: allocatedChoice ? allocatedChoice.preferenceNumber : null,
      cutoffInThisRound: cutoffForAllocated,
      upgradeProbability: upgradeProb,
      recommendedAction,
      actionExplanation,
      alternativeChoicesEligible: choices.filter(
        (c) => c.prediction.studentRankUsed <= c.prediction.predictedClosingRank * multiplier
      ).length,
    });
  }

  return steps;
}
