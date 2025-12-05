/**
 * AI Blogs Studio - Settings
 * Account settings, subscription management, profile preferences
 */

import React from 'react';
import { AiBlogsPage } from './index';
import ProfileSettings from './pages/ProfileSettings';

interface SettingsProps {
  onNavigate: (page: AiBlogsPage) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  return <ProfileSettings onNavigate={onNavigate} />;
};

export default Settings;