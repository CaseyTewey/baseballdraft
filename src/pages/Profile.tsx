import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ProfileForm } from '../components/ProfileForm';

interface Profile {
  username: string;
}

export function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          setProfile(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
          {profile && (
            <ProfileForm
              initialUsername={profile.username}
              userId={user.id}
              onSuccess={(newUsername) => setProfile({ username: newUsername })}
            />
          )}
        </div>
      </div>
    </div>
  );
}