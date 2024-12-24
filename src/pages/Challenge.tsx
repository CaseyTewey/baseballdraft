import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChallenge } from '../hooks/useChallenge';
import { useChallengeAttempt } from '../hooks/useChallengeAttempt';
import { ChallengeHeader } from '../components/challenge/ChallengeHeader';
import { ExistingAttempt } from '../components/challenge/ExistingAttempt';
import { NewAttempt } from '../components/challenge/NewAttempt';
import { ProfileStats } from '../components/profile/ProfileStats';

export function Challenge() {
  const { user } = useAuth();
  const { challenges, isLoading: challengeLoading, error: challengeError } = useChallenge();
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  const currentChallenge = challenges[currentChallengeIndex];
  const isLastChallenge = currentChallengeIndex === challenges.length - 1;
  
  const { 
    attempt, 
    isLoading: attemptLoading, 
    error: attemptError,
    mutate: refreshAttempt
  } = useChallengeAttempt(user?.id, currentChallenge?.id);

  const handleNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
    }
  };

  const handleAttemptSubmitted = async () => {
    await refreshAttempt();
  };

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

  if (!currentChallenge) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600">
              {challenges.length === 0 
                ? "No challenges available yet"
                : "You've completed all available challenges! Check back later for new ones."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileStats userId={user.id} />
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-500 mb-4">
            Challenge {currentChallengeIndex + 1} of {challenges.length}
          </div>
          <ChallengeHeader challenge={currentChallenge} />
          {attempt ? (
            <div>
              <ExistingAttempt 
                attempt={attempt} 
                challenge={currentChallenge} 
                onNext={handleNextChallenge}
                isLastChallenge={isLastChallenge}
              />
              {isLastChallenge && (
                <div className="mt-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-700">
                      🎉 Congratulations! You've completed all available challenges.
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      Check back later for new challenges!
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NewAttempt 
              challenge={currentChallenge} 
              userId={user.id} 
              onSubmitted={handleAttemptSubmitted} 
            />
          )}
        </div>
      </div>
    </div>
  );
}