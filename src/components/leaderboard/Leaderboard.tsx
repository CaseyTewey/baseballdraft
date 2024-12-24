import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  email: string;
  total_score: number;
  accuracy: number;
  challenges_completed: number;
}

interface LeaderboardProps {
  limit?: number;
}

export function Leaderboard({ limit = 10 }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [page, limit]);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get all challenge attempts with user profiles
      const { data: attemptData, error: attemptError } = await supabase
        .from('challenge_attempts')
        .select(`
          user_id,
          score,
          challenges:challenge_id (
            players_pool,
            pick_limit,
            rule
          ),
          profiles (
            email_address
          )
        `)
        .order('created_at', { ascending: false });

      if (attemptError) throw attemptError;

      if (!attemptData) {
        setEntries([]);
        return;
      }

      // Process the data to calculate user stats
      const userStats = new Map<string, {
        user_id: string;
        email: string;
        total_score: number;
        challenges_completed: number;
        accuracy: number;
      }>();

      attemptData.forEach(attempt => {
        const userId = attempt.user_id;
        const email = attempt.profiles?.email_address || 'Unknown User';
        const currentStats = userStats.get(userId) || {
          user_id: userId,
          email,
          total_score: 0,
          challenges_completed: 0,
          accuracy: 0
        };

        // Calculate best possible score for this challenge
        const challenge = attempt.challenges;
        if (challenge) {
          const bestPossible = getBestPossibleScore(
            challenge.players_pool,
            challenge.pick_limit,
            challenge.rule
          );

          // Update user stats
          currentStats.total_score += attempt.score;
          currentStats.challenges_completed += 1;
          currentStats.accuracy = ((attempt.score / bestPossible) * 100 + 
            (currentStats.accuracy * (currentStats.challenges_completed - 1))) / 
            currentStats.challenges_completed;
        }

        userStats.set(userId, currentStats);
      });

      // Convert to array and sort by total score
      const sortedEntries = Array.from(userStats.values())
        .sort((a, b) => b.total_score - a.total_score)
        .map((stats, index) => ({
          rank: index + 1,
          ...stats,
          accuracy: Math.round(stats.accuracy * 10) / 10
        }));

      // Apply pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedEntries = sortedEntries.slice(start, end);
      
      setHasMore(end < sortedEntries.length);
      setEntries(paginatedEntries);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Rank</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Player</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Total Score</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Accuracy</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Challenges</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.user_id} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-semibold
                      ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                        entry.rank === 2 ? 'bg-gray-100 text-gray-700' :
                        entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-50 text-blue-700'}
                    `}>
                      {entry.rank}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-900">{entry.email}</td>
                <td className="py-3 px-4 text-gray-900">{entry.total_score}</td>
                <td className="py-3 px-4 text-gray-900">{entry.accuracy}%</td>
                <td className="py-3 px-4 text-gray-900">{entry.challenges_completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(page > 1 || hasMore) && (
        <div className="mt-4 flex justify-between">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md ${
              page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={!hasMore}
            className={`px-4 py-2 rounded-md ${
              !hasMore
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate best possible score
function getStatTypeFromRule(rule: string): string {
  if (rule.toLowerCase().includes('rbi')) return 'rbis';
  if (rule.toLowerCase().includes('stolen base')) return 'sb';
  if (rule.toLowerCase().includes('home run')) return 'hrs';
  return 'hrs';
}

function getBestPossibleScore(players: any[], pickLimit: number, rule: string): number {
  const statType = getStatTypeFromRule(rule);
  const sortedPlayers = [...players].sort((a, b) => 
    (b.stats[statType] || 0) - (a.stats[statType] || 0)
  );
  return sortedPlayers
    .slice(0, pickLimit)
    .reduce((sum, player) => sum + (player.stats[statType] || 0), 0);
} 