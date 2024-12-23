import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChallenge } from '../hooks/useChallenge';
import { useChallengeAttempt } from '../hooks/useChallengeAttempt';
import { ChallengeHeader } from '../components/challenge/ChallengeHeader';
import { ExistingAttempt } from '../components/challenge/ExistingAttempt';
import { NewAttempt } from '../components/challenge/NewAttempt';

export function Challenge() {
  const { user } = useAuth();
  const { challenge, isLoading: challengeLoading, error: challengeError } = useChallenge();
  const { 
    attempt, 
    isLoading: attemptLoading, 
    error: attemptError 
  } = useChallengeAttempt(user?.id, challenge?.id);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const isLoading = challengeLoading || attemptLoading;
  const error = challengeError || attemptError;

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading challenge...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600">No challenge available today</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <ChallengeHeader challenge={challenge} />
          {attempt ? (
            <ExistingAttempt attempt={attempt} challenge={challenge} />
          ) : (
            <NewAttempt challenge={challenge} userId={user.id} />
          )}
        </div>
      </div>
    </div>
  );
}