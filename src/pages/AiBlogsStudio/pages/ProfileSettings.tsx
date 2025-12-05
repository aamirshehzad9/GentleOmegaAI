/**
 * USER PROFILE SETTINGS PAGE
 * Complete profile management with avatar upload, password change, email preferences
 */

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../contexts/AuthContext';
import { updateProfile, updatePassword, sendEmailVerification } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../../../../firebase/config';
import BlogsHeader from '../components/BlogsHeader';
import BlogsFooter from '../components/BlogsFooter';
import { AiBlogsPage } from '../index';

interface ProfileSettingsProps {
  onNavigate: (page: AiBlogsPage) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'billing'>('profile');
  
  // Profile state
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  const [uploading, setUploading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState({ type: '', text: '' });

  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState({
    blogPublished: true,
    earningsUpdate: true,
    weeklyReport: true,
    promotions: false,
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !currentUser) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      setProfileMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    setUploading(true);
    setProfileMessage({ type: '', text: '' });

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `avatars/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile
      await updateProfile(currentUser, { photoURL: downloadURL });

      // Update Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });

      setProfileMessage({ type: 'success', text: 'Avatar updated successfully!' });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      setProfileMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setProfileMessage({ type: '', text: '' });

    try {
      // Update Firebase Auth profile
      if (displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName });
      }

      // Update Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { displayName, bio });

      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setProfileMessage({ type: 'error', text: error.message });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSecurityMessage({ type: '', text: '' });

    // Validation
    if (newPassword.length < 6) {
      setSecurityMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      await updatePassword(currentUser, newPassword);
      setSecurityMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setSecurityMessage({ 
          type: 'error', 
          text: 'For security, please log out and log back in before changing your password' 
        });
      } else {
        setSecurityMessage({ type: 'error', text: error.message });
      }
    }
  };

  const handleVerifyEmail = async () => {
    if (!currentUser) return;

    try {
      await sendEmailVerification(currentUser);
      setSecurityMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
    } catch (error: any) {
      setSecurityMessage({ type: 'error', text: error.message });
    }
  };

  const handlePreferencesUpdate = async () => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { 
        emailPreferences: emailNotifications,
        updatedAt: new Date()
      });
      setProfileMessage({ type: 'success', text: 'Preferences saved!' });
    } catch (error: any) {
      setProfileMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      <BlogsHeader context="user" onNavigate={onNavigate} currentPage="settings" />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your profile, security, and preferences</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-8 overflow-x-auto">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'security', label: 'Security', icon: '🔒' },
              { id: 'preferences', label: 'Preferences', icon: '⚙️' },
              { id: 'billing', label: 'Billing', icon: '💳' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white'
                    : 'bg-[#1A1F3A]/50 text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1A1F3A]/50 backdrop-blur-xl border border-[#F7B731]/20 rounded-2xl p-8"
          >
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

                {/* Avatar Upload */}
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <img
                      src={currentUser?.photoURL || 'https://via.placeholder.com/150'}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full border-4 border-[#F7B731] object-cover"
                    />
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Profile Picture</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      JPG, GIF or PNG. Max size of 5MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-6 py-2 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload New Photo'}
                    </button>
                  </div>
                </div>

                {/* Messages */}
                {profileMessage.text && (
                  <div className={`p-4 rounded-lg ${
                    profileMessage.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {profileMessage.text}
                  </div>
                )}

                {/* Profile Form */}
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0E27] border border-[#F7B731]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F7B731] focus:ring-2 focus:ring-[#F7B731]/20"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-[#0A0E27]/50 border border-[#F7B731]/20 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio (Optional)
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 bg-[#0A0E27] border border-[#F7B731]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F7B731] focus:ring-2 focus:ring-[#F7B731]/20 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{bio.length}/500 characters</p>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>

                {/* Email Verification */}
                {!currentUser?.emailVerified && (
                  <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">⚠️</div>
                      <div className="flex-1">
                        <h3 className="text-yellow-400 font-semibold mb-2">Email Not Verified</h3>
                        <p className="text-gray-400 text-sm mb-4">
                          Please verify your email address to unlock all features
                        </p>
                        <button
                          onClick={handleVerifyEmail}
                          className="px-6 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                        >
                          Send Verification Email
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                {securityMessage.text && (
                  <div className={`p-4 rounded-lg ${
                    securityMessage.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {securityMessage.text}
                  </div>
                )}

                {/* Change Password */}
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">Change Password</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0E27] border border-[#F7B731]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F7B731] focus:ring-2 focus:ring-[#F7B731]/20"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-[#0A0E27] border border-[#F7B731]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F7B731] focus:ring-2 focus:ring-[#F7B731]/20"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-[#0A0E27] border border-[#F7B731]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F7B731] focus:ring-2 focus:ring-[#F7B731]/20"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white mb-6">Email Preferences</h2>

                <div className="space-y-4">
                  {[
                    { key: 'blogPublished', label: 'Blog Published Notifications', desc: 'Get notified when your blog is published' },
                    { key: 'earningsUpdate', label: 'Earnings Updates', desc: 'Daily updates on your earnings and revenue' },
                    { key: 'weeklyReport', label: 'Weekly Performance Report', desc: 'Comprehensive weekly analytics report' },
                    { key: 'promotions', label: 'Promotions & Updates', desc: 'New features, tips, and special offers' },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-start justify-between p-4 bg-[#0A0E27]/50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{pref.label}</h3>
                        <p className="text-gray-400 text-sm">{pref.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={emailNotifications[pref.key as keyof typeof emailNotifications]}
                          onChange={(e) => setEmailNotifications({
                            ...emailNotifications,
                            [pref.key]: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F7B731]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F7B731]"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePreferencesUpdate}
                  className="px-8 py-3 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white mb-6">Billing & Subscription</h2>

                <div className="p-6 bg-[#0A0E27]/50 border border-[#F7B731]/20 rounded-lg text-center">
                  <div className="text-6xl mb-4">💳</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Stripe Integration Coming Soon</h3>
                  <p className="text-gray-400 mb-6">
                    Subscription management will be available after Stripe integration is complete
                  </p>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-8 py-3 bg-gradient-to-r from-[#F7B731] to-[#5F27CD] text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <BlogsFooter context="user" onNavigate={onNavigate} />
    </div>
  );
};

export default ProfileSettings;
