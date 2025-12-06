import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import DashboardPlaceholder from './components/DashboardPlaceholder';
import AdminDashboard from './components/AdminDashboard';
import PaymentCheckout from './components/PaymentCheckout';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage';
import ChatWidget from './components/ChatWidget';
import GoAibobIndex from './src/pages/GoAibob';
import AiBlogsStudio from './src/pages/AiBlogsStudio';
import { analytics } from './src/utils/analytics';
import { useAuth } from './contexts/AuthContext';

// Layout component that includes Header and Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Track page views on route change
  useEffect(() => {
    analytics.trackPageView({
      path: location.pathname,
      title: document.title,
      referrer: document.referrer,
    });
  }, [location.pathname]);

  // Convert path to Page type for Header
  const getPageFromPath = (): string => {
    const path = location.pathname.slice(1) || 'home';
    return path;
  };

  // Navigation helper that uses React Router
  const handleNavigate = (page: string) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
  };

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen">
      <Header navigate={handleNavigate} currentPage={getPageFromPath()} />
      <main>
        {children}
      </main>
      <Footer navigate={handleNavigate} />
      <ChatWidget />
    </div>
  );
};

// Wrapper components to provide navigate function
const HomePageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(page === 'home' ? '/' : `/${page}`);
  return <HomePage navigate={handleNavigate} />;
};

const AdminDashboardWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(page === 'home' ? '/' : `/${page}`);
  return <AdminDashboard navigate={handleNavigate} />;
};

const PaymentCheckoutWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(page === 'home' ? '/' : `/${page}`);
  return <PaymentCheckout navigate={handleNavigate} />;
};

const LoginPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(page === 'home' ? '/' : `/${page}`);
  return <LoginPage navigate={handleNavigate} />;
};

const SignupPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(page === 'home' ? '/' : `/${page}`);
  return <SignupPage navigate={handleNavigate} />;
};

const ProfilePageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(page === 'home' ? '/' : `/${page}`);
  return <ProfilePage navigate={handleNavigate} />;
};

const App: React.FC = () => {
  const { currentUser } = useAuth();

  // Initialize analytics on app load
  useEffect(() => {
    analytics.initialize().then(() => {
      console.log('[App] Analytics initialized successfully');
      
      // Identify user if logged in
      if (currentUser) {
        analytics.identifyUser({
          userId: currentUser.uid,
          email: currentUser.email || undefined,
          name: currentUser.displayName || undefined,
          properties: {
            email_verified: currentUser.emailVerified,
            creation_time: currentUser.metadata.creationTime,
          },
        });
      }
    });
  }, [currentUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePageWrapper /></Layout>} />
        <Route path="/menu" element={<Layout><MenuPage /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPlaceholder /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboardWrapper /></Layout>} />
        <Route path="/checkout" element={<Layout><PaymentCheckoutWrapper /></Layout>} />
        <Route path="/login" element={<Layout><LoginPageWrapper /></Layout>} />
        <Route path="/signup" element={<Layout><SignupPageWrapper /></Layout>} />
        <Route path="/profile" element={<Layout><ProfilePageWrapper /></Layout>} />
        <Route path="/go-aibob" element={<Layout><GoAibobIndex /></Layout>} />
        
        {/* AI Blogs Studio - NO Layout (has its own header/footer) */}
        <Route path="/AIBlogsStudio" element={<AiBlogsStudio />} />
        <Route path="/ai-blogs-studio" element={<Navigate to="/AIBlogsStudio" replace />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
