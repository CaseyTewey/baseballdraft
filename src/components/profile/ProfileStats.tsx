import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ProfileStatsProps {
  userId: string;
}

interface UserStats {
  totalAttempts: number;
  averageScore: number;
  averageAccuracy: number;
  averageVsRandom: number;
  bestScore: number;
}

export function ProfileStats({ userId }: ProfileStatsProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);

        // Get all attempts for this user
        const { data: attempts, error: attemptsError } = await supabase
          .from('challenge_attempts')
          .select(`
            *,
            challenges (
              players_pool,
              pick_limit,
              rule
            )
          `)
          .eq('user_id', userId);

        if (attemptsError) throw attemptsError;

        if (!attempts || attempts.length === 0) {
          setStats(null);
          return;
        }

        // Calculate stats
        const totalAttempts = attempts.length;
        const scores = attempts.map(a => a.score);
        const bestScore = Math.max(...scores);
        const averageScore = scores.reduce((a, b) => a + b, 0) / totalAttempts;

        // Calculate accuracy (score vs best possible score) and vs random performance
        const accuracies = attempts.map(attempt => {
          const challenge = attempt.challenges;
          const bestPossible = getBestPossibleScore(challenge.players_pool, challenge.pick_limit, challenge.rule);
          return (attempt.score / bestPossible) * 100;
        });

        const vsRandomPerformances = attempts.map(attempt => {
          const challenge = attempt.challenges;
          const expectedRandom = getExpectedRandomScore(challenge.players_pool, challenge.pick_limit, challenge.rule);
          return ((attempt.score - expectedRandom) / expectedRandom) * 100;
        });

        setStats({
          totalAttempts,
          averageScore: Math.round(averageScore * 10) / 10,
          averageAccuracy: Math.round(accuracies.reduce((a, b) => a + b, 0) / totalAttempts * 10) / 10,
          averageVsRandom: Math.round(vsRandomPerformances.reduce((a, b) => a + b, 0) / totalAttempts * 10) / 10,
          bestScore
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  if (isLoading) {
    return <div className="text-gray-500">Loading stats...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div className="text-gray-500">No attempts yet</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600">Total Challenges</div>
          <div className="text-2xl font-semibold text-blue-700">{stats.totalAttempts}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600">Average Accuracy</div>
          <div className="text-2xl font-semibold text-green-700">{stats.averageAccuracy}%</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600">vs Random Picks</div>
          <div className="text-2xl font-semibold text-purple-700">
            {stats.averageVsRandom > 0 ? '+' : ''}{stats.averageVsRandom}%
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-yellow-600">Best Score</div>
          <div className="text-2xl font-semibold text-yellow-700">{stats.bestScore}</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm text-indigo-600">Average Score</div>
          <div className="text-2xl font-semibold text-indigo-700">{stats.averageScore}</div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStatTypeFromRule(rule: string): string {
  const lowerRule = rule.toLowerCase();
  if (lowerRule.includes('rbi')) return 'rbis';
  if (lowerRule.includes('stolen base')) return 'sb';
  if (lowerRule.includes('home run')) return 'hrs';
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

function getExpectedRandomScore(players: any[], pickLimit: number, rule: string): number {
  const statType = getStatTypeFromRule(rule);
  const totalStats = players.reduce((sum, player) => {
    return sum + (player.stats?.[statType] || 0);
  }, 0);
  
  return Math.round((totalStats / players.length) * pickLimit);
} 