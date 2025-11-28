/**
 * Admin Dashboard - Real-time Chat Management
 * Synced with WhatsApp Business (+923108537693)
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';
import { getWhatsAppConversations } from '../utils/whatsapp-service';
import { isAdmin } from '../utils/admin-check';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

interface DashboardProps {
  navigate: (page: Page) => void;
}

interface ChatMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  profileName?: string;
  timestamp: any;
  direction: 'inbound' | 'outbound';
  status: string;
}

const AdminDashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chats' | 'analytics'>('chats');
  const [onlineStatus, setOnlineStatus] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('login');
      return;
    }

    // Check if user is admin
    if (!isAdmin(currentUser.email)) {
      alert('Access Denied: You do not have admin privileges.');
      navigate('home');
      return;
    }

    // Real-time listener for WhatsApp messages
    const messagesRef = collection(db, 'whatsapp_messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(chats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getMessageStats = () => {
    const total = messages.length;
    const inbound = messages.filter(m => m.direction === 'inbound').length;
    const outbound = messages.filter(m => m.direction === 'outbound').length;
    return { total, inbound, outbound };
  };

  const stats = getMessageStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Logo" className="w-16 h-16" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  GentleΩmega Admin Dashboard
                </h1>
                <p className="text-gray-400 mt-1">WhatsApp Chat Management & Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Online Status Toggle */}
              <div className="flex items-center gap-3 bg-gray-700/50 px-4 py-2 rounded-lg">
                <span className="text-gray-300 text-sm">Status:</span>
                <button
                  onClick={() => setOnlineStatus(!onlineStatus)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    onlineStatus ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      onlineStatus ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-semibold ${onlineStatus ? 'text-green-400' : 'text-gray-400'}`}>
                  {onlineStatus ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3 bg-gray-700/50 px-4 py-2 rounded-lg">
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">{currentUser?.displayName || 'Admin'}</p>
                  <p className="text-gray-400 text-xs">{currentUser?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Messages</p>
                  <p className="text-white text-3xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Incoming</p>
                  <p className="text-white text-3xl font-bold mt-1">{stats.inbound}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Outgoing</p>
                  <p className="text-white text-3xl font-bold mt-1">{stats.outbound}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-t-2xl border-t border-x border-gray-700 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'chats'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              💬 Live Chats
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              📊 Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-b-2xl border-b border-x border-gray-700 p-6">
          {activeTab === 'chats' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Conversations</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Synced with WhatsApp +92 310 853 7693
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No messages yet</p>
                  <p className="text-gray-500 text-sm mt-2">Messages will appear here when users start chatting</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border ${
                        msg.direction === 'inbound'
                          ? 'bg-blue-500/10 border-blue-500/30'
                          : 'bg-green-500/10 border-green-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            msg.direction === 'inbound'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {msg.direction === 'inbound' ? '📩 Incoming' : '📤 Outgoing'}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {msg.profileName || msg.from.replace('whatsapp:', '')}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {msg.timestamp?.toDate?.()?.toLocaleString() || 'Just now'}
                        </span>
                      </div>
                      <p className="text-white text-sm whitespace-pre-wrap">{msg.body}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-4">Analytics Coming Soon</h2>
              <p className="text-gray-400">
                Advanced analytics and reporting features will be available here
              </p>
            </div>
          )}
        </div>

        {/* WhatsApp Integration Info */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 mt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2">WhatsApp Business Integration Active</h3>
              <p className="text-gray-400 text-sm mb-4">
                All messages are automatically synced with your WhatsApp Business number: <span className="text-green-400 font-semibold">+92 310 853 7693</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time message sync
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Auto-forward when offline
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Category-based routing
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Business hours support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
