// Authentication Context - Global user state management
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/auth';
import { getUserProfile, UserProfile } from '../firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  isAuthenticated: false,
});

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Timeout to prevent infinite loading (e.g. if Firebase fails)
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('Auth initialization timed out');
        setLoading(false);
      }
    }, 5000);

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth State Changed:', user ? 'User logged in' : 'No user');
      setCurrentUser(user);

      // Fetch user profile from Firestore if user exists
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.warn('Could not fetch user profile:', error);
          // Set profile to null but don't crash the app
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
      clearTimeout(timeout);
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    isAuthenticated: !!currentUser,
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-black text-white">Loading Auth...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
