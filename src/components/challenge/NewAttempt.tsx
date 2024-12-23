import React, { useState } from 'react';
import { DailyChallenge, Player } from '../../types/Challenge';
import { challengeAttemptService } from '../../services/challengeAttemptService';
import { PlayerSelection } from './PlayerSelection';

interface NewAttemptProps {
  challenge: DailyChallenge;
  userId: string;
}

export function NewAttempt({ challenge, userId }: NewAttemptProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (selectedPlayers: Player[]) => {
    try {
      const totalScore = selectedPlayers.reduce((sum, player) => {
        // Sum up the relevant stat based on the challenge rule
        const statValue = player.stats.hrs || 0; // Adjust based on challenge type
        return sum + statValue;
      }, 0);

      await challengeAttemptService.insertAttempt({
        userId,
        challengeId: challenge.id,
        score: totalScore,
        picks: selectedPlayers.map(player => ({
          player_id: player.id,
          name: player.name,
          stat_value: player.stats.hrs || 0 // Adjust based on challenge type
        }))
      });
      
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit attempt');
    }
  };

  if (!challenge.players_pool) {
    return <div className="text-red-500">No players available for this challenge</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <PlayerSelection
        players={challenge.players_pool}
        maxPicks={challenge.pick_limit}
        onSubmit={handleSubmit}
      />
    </div>
  );
}