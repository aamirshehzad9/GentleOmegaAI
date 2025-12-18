/**
 * Admin Index - Main entry point for GO-AIBOB Admin Panel
 * Routes to AdminDashboard with sidebar navigation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import { isAdmin } from '../../../utils/admin-check';
import AdminDashboard from './AdminDashboard';
import LoadingSpinner from '../../../components/LoadingSpinner';

const AdminIndex: React.FC = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Direct Firebase Auth
    useEffect(() => {
        if (!auth) {
            setError('Firebase authentication is not initialized');
            setLoading(false);
            return;
        }

        try {
            const unsubscribe = onAuthStateChanged(
                auth,
                (user) => {
                    setCurrentUser(user);
                    setLoading(false);
                },
                (error) => {
                    console.error('Auth error:', error);
                    setError('Authentication error');
                    setLoading(false);
                }
            );
            return unsubscribe;
        } catch (err) {
            console.error('Failed to initialize auth:', err);
            setError('Failed to initialize');
            setLoading(false);
        }
    }, []);

    // Check admin access
    const userIsAdmin = isAdmin(currentUser?.email || null);

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-400 text-xl mb-4">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/go-aibob')}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            Go to Public Site
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Redirect non-admin users to public site
    if (!currentUser || !userIsAdmin) {
        navigate('/go-aibob/login');
        return null;
    }

    // Render admin dashboard
    return <AdminDashboard />;
};

export default AdminIndex;
