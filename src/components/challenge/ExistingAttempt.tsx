import React from 'react';
import { ChallengeAttempt } from '../../types/ChallengeAttempt';
import { DailyChallenge } from '../../types/Challenge';
import { calculateExpectedRandomScore, calculateScoreImprovement } from '../../utils/scoreUtils';

interface ExistingAttemptProps {
  attempt: ChallengeAttempt;
  challenge: DailyChallenge;
}

export function ExistingAttempt({ attempt, challenge }: ExistingAttemptProps) {
  const expectedRandomScore = calculateExpectedRandomScore(challenge.players_pool || [], challenge.pick_limit);
  const improvement = calculateScoreImprovement(attempt.score, expectedRandomScore);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-700 mb-2">
          You've already played today! Your score: {attempt.score}
        </p>
        <p className="text-sm text-blue-600">
          Expected random score: {expectedRandomScore.toFixed(2)}
        </p>
        <p className="text-sm text-blue-600">
          Your performance vs random: {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
        </p>
      </div>
      
      <div>
        <h2 className="font-semibold text-gray-900 mb-2">Your Picks:</h2>
        <div className="space-y-2">
          {attempt.picks.map((pick) => (
            <div
              key={pick.player_id}
              className="bg-gray-50 p-3 rounded-md flex justify-between"
            >
              <span>{pick.name}</span>
              <span className="font-medium">{pick.stat_value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}