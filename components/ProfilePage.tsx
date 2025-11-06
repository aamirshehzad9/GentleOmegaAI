// User Profile Page - View and edit user information
import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { logout, resendVerificationEmail } from '../firebase/auth';
import { updateProfile } from 'firebase/auth';
import { ICONS } from '../constants';

interface ProfilePageProps {
  navigate: (page: Page) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await updateProfile(currentUser, {
        displayName: displayName,
      });
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('home');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1a1a1a] to-[#0D0D0D] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    navigate('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1a1a1a] to-[#0D0D0D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('home')}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg border border-red-500/50 transition-colors font-medium"
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
            <p className="text-green-500 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary */}
          <div className="md:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 p-6">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-cyan-500/30 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-cyan-500/30">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name */}
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                {currentUser.displayName || 'User'}
              </h2>

              {/* Email */}
              <p className="text-gray-400 text-center mb-4 break-all">
                {currentUser.email}
              </p>

              {/* Email Verification Status */}
              {!currentUser.emailVerified && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-500 text-sm text-center mb-2">
                    Email not verified
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={loading}
                    className="w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </div>
              )}

              {/* Account Info */}
              <div className="space-y-3 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className={`${currentUser.emailVerified ? 'text-green-500' : 'text-yellow-500'} font-medium`}>
                    {currentUser.emailVerified ? '✓ Verified' : '⚠ Unverified'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Account Type</span>
                  <span className="text-white font-medium">
                    {currentUser.providerData[0]?.providerId.includes('google') ? 'Google' :
                     currentUser.providerData[0]?.providerId.includes('github') ? 'GitHub' :
                     currentUser.providerData[0]?.providerId.includes('microsoft') ? 'Microsoft' :
                     'Email'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="md:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Profile Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={currentUser.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(currentUser.displayName || '');
                      }}
                      className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors border border-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Display Name
                    </label>
                    <p className="text-white text-lg">
                      {currentUser.displayName || 'Not set'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <p className="text-white text-lg break-all">
                      {currentUser.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      User ID
                    </label>
                    <p className="text-gray-500 text-sm font-mono break-all">
                      {currentUser.uid}
                    </p>
                  </div>

                  {userProfile && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Member Since
                        </label>
                        <p className="text-white text-lg">
                          {userProfile.createdAt?.toDate?.().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) || 'Unknown'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Last Login
                        </label>
                        <p className="text-white text-lg">
                          {userProfile.lastLoginAt?.toDate?.().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) || 'Unknown'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
