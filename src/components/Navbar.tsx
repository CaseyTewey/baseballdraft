import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900"
            >
              <span className="text-xl font-bold">Baseball Draft</span>
            </Link>
            {user && (
              <>
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 ml-4 text-gray-700 hover:text-gray-900"
                >
                  Draft Challenge
                </Link>
                <Link
                  to="/leaderboard"
                  className="flex items-center px-3 py-2 ml-4 text-gray-700 hover:text-gray-900"
                >
                  Leaderboard
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}