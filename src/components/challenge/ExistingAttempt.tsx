import React, { useState } from 'react';
import { ChallengeAttempt } from '../../types/ChallengeAttempt';
import { Challenge } from '../../types/Challenge';
import { calculateExpectedRandomScore, calculateScoreImprovement } from '../../utils/scoreUtils';

interface ExistingAttemptProps {
  attempt: ChallengeAttempt;
  challenge: Challenge;
  onNext?: () => void;
  isLastChallenge?: boolean;
}

function getStatTypeFromRule(rule: string): string {
  if (rule.toLowerCase().includes('rbi')) return 'rbis';
  if (rule.toLowerCase().includes('stolen base')) return 'sb';
  if (rule.toLowerCase().includes('home run')) return 'hrs';
  return 'hrs'; // default fallback
}

function calculateBestPossibleScore(players: any[], pickLimit: number, statType: string): number {
  const sortedPlayers = [...players].sort((a, b) => 
    (b.stats[statType] || 0) - (a.stats[statType] || 0)
  );
  return sortedPlayers
    .slice(0, pickLimit)
    .reduce((sum, player) => sum + (player.stats[statType] || 0), 0);
}

export function ExistingAttempt({ attempt, challenge, onNext, isLastChallenge }: ExistingAttemptProps) {
  const [showAllStats, setShowAllStats] = useState(false);
  const statType = getStatTypeFromRule(challenge.rule);
  
  const expectedRandomScore = calculateExpectedRandomScore(
    challenge.players_pool || [], 
    challenge.pick_limit,
    challenge.rule
  );
  const improvement = calculateScoreImprovement(attempt.score, expectedRandomScore);

  // Calculate best possible score
  const bestPossibleScore = calculateBestPossibleScore(
    challenge.players_pool || [],
    challenge.pick_limit,
    statType
  );

  // Calculate percentage of best possible score
  const percentageOfBest = ((attempt.score / bestPossibleScore) * 100).toFixed(1);

  // Sort players by their stat value in descending order
  const sortedPlayers = [...(challenge.players_pool || [])].sort((a, b) => 
    (b.stats[statType] || 0) - (a.stats[statType] || 0)
  );

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-3">
          <p className="text-blue-700">
            Your score: {attempt.score}
          </p>
          <p className="text-blue-700">
            Best possible: {bestPossibleScore}
          </p>
        </div>
        <p className="text-sm text-blue-600 mb-1">
          You achieved {percentageOfBest}% of the best possible score
        </p>
        <p className="text-sm text-blue-600 mb-1">
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

      {!isLastChallenge && onNext && (
        <div className="mt-6">
          <button
            onClick={onNext}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Next Challenge →
          </button>
        </div>
      )}

      <div className="border-t pt-4">
        <button
          onClick={() => setShowAllStats(!showAllStats)}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          {showAllStats ? '↑ Hide' : '↓ Show'} All Player Stats
        </button>
        
        {showAllStats && (
          <div className="mt-3 space-y-2">
            <div className="text-sm text-gray-500 mb-2">
              Players ranked by {statType}:
            </div>
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`p-3 rounded-md flex justify-between ${
                  attempt.picks.some(pick => pick.player_id === player.id)
                    ? 'bg-blue-50 border border-blue-100'
                    : index < challenge.pick_limit ? 'bg-green-50 border border-green-100' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">#{index + 1}</span>
                  <span>{player.name}</span>
                  {index < challenge.pick_limit && !attempt.picks.some(pick => pick.player_id === player.id) && (
                    <span className="text-xs text-green-600">(Optimal pick)</span>
                  )}
                </div>
                <span className="font-medium">{player.stats[statType] || 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}