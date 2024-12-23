import React from 'react';
import { DailyChallenge } from '../../types/Challenge';

interface ChallengeHeaderProps {
  challenge: DailyChallenge;
}

export function ChallengeHeader({ challenge }: ChallengeHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Today's Challenge
      </h1>
      <p className="text-lg text-gray-700">
        {challenge.rule} — Pick {challenge.pick_limit} players!
      </p>
    </div>
  );
}