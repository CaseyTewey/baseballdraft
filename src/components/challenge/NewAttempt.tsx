import React, { useState } from 'react';
import { Challenge } from '../../types/Challenge';
import { supabase } from '../../lib/supabase';
import { getStatTypeFromRule } from '../../utils/statUtils';

interface Player {
  id: string;
  name: string;
  team: string;
  stats: {
    [key: string]: number;
  };
}

interface NewAttemptProps {
  challenge: Challenge;
  userId: string;
  onSubmitted?: () => void;
}

export function NewAttempt({ challenge, userId, onSubmitted }: NewAttemptProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlayerSelect = (player: Player) => {
    if (selectedPlayers.some(p => p.id === player.id)) {
      setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
    } else if (selectedPlayers.length < challenge.pick_limit) {
      setSelectedPlayers(prev => [...prev, player]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPlayers.length !== challenge.pick_limit) {
      setError(`Please select exactly ${challenge.pick_limit} players.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const statType = getStatTypeFromRule(challenge.rule);
      const totalScore = selectedPlayers.reduce((sum, player) => {
        return sum + (player.stats[statType] || 0);
      }, 0);

      // First insert the attempt
      const { data: insertedData, error: submitError } = await supabase
        .from('challenge_attempts')
        .insert([
          {
            challenge_id: challenge.id,
            user_id: userId,
            picks: selectedPlayers.map(player => ({
              player_id: player.id,
              name: player.name,
              stat_value: player.stats[statType] || 0
            })),
            score: totalScore
          },
        ])
        .select()
        .single();

      if (submitError) throw submitError;

      // Verify the data was inserted by checking it exists
      const { data: verifyData, error: verifyError } = await supabase
        .from('challenge_attempts')
        .select('*')
        .eq('challenge_id', challenge.id)
        .eq('user_id', userId)
        .maybeSingle();

      if (verifyError) throw verifyError;
      
      if (!verifyData) {
        throw new Error('Failed to verify attempt was saved');
      }

      // Only call onSubmitted if we've verified the data exists
      onSubmitted?.();
    } catch (err) {
      console.error('Error submitting attempt:', err);
      setError('Failed to submit attempt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Select {challenge.pick_limit} players:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {challenge.players_pool.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => handlePlayerSelect(player)}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedPlayers.some(p => p.id === player.id)
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-medium">{player.name}</div>
                <div className="text-sm text-gray-500">{player.team}</div>
              </button>
            ))}
          </div>
        </div>
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        <button
          type="submit"
          disabled={isSubmitting || selectedPlayers.length !== challenge.pick_limit}
          className={`w-full py-2 px-4 rounded-md text-white transition-colors ${
            isSubmitting || selectedPlayers.length !== challenge.pick_limit
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Picks'}
        </button>
      </form>
    </div>
  );
}