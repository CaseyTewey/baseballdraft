import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center text-center px-4">
      <Trophy className="w-16 h-16 text-blue-600 mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Welcome to MLB Draft Battle
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Test your baseball knowledge and compete with others in predicting the next MLB stars.
      </p>
      <Link
        to="/auth"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-500 transition-colors"
      >
        Get Started
      </Link>
    </div>
  );
}