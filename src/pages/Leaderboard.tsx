import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Leaderboard as LeaderboardComponent } from '../components/leaderboard/Leaderboard';

export function Leaderboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Global Rankings
          </h1>
          <p className="text-gray-600">
            See how you stack up against other players based on total score and accuracy.
          </p>
        </div>

        <LeaderboardComponent limit={10} />
      </div>
    </div>
  );
} 