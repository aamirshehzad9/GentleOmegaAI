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
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import GoAibobIndex from './src/pages/GoAibob';
import AiBlogsStudio from './src/pages/AiBlogsStudio';
import { analytics } from './src/utils/analytics';
import { AuthProvider } from './contexts/AuthContext';

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
      <Footer />
      <ChatWidget />
    </div>
  );
};

// Wrapper components for type safety
const HomePageWrapper = () => <HomePage />;
const AdminDashboardWrapper = () => <AdminDashboard />;
const PaymentCheckoutWrapper = () => <PaymentCheckout />;

// Login and Signup need navigate function
const LoginPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
  };
  return <LoginPage navigate={handleNavigate} />;
};

const SignupPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
  };
  return <SignupPage navigate={handleNavigate} />;
};

const ProfilePageWrapper = () => <ProfilePage />;
const PrivacyPolicyWrapper = () => <PrivacyPolicy />;
const TermsOfServiceWrapper = () => <TermsOfService />;

// Main App component with routing
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePageWrapper /></Layout>} />
        <Route path="/menu" element={<Layout><MenuPage /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPlaceholder /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboardWrapper /></Layout>} />
        <Route path="/checkout" element={<Layout><PaymentCheckoutWrapper /></Layout>} />
        <Route path="/login" element={<LoginPageWrapper />} />
        <Route path="/signup" element={<SignupPageWrapper />} />
        <Route path="/profile" element={<Layout><ProfilePageWrapper /></Layout>} />
        <Route path="/privacy-policy" element={<Layout><PrivacyPolicyWrapper /></Layout>} />
        <Route path="/terms-of-service" element={<Layout><TermsOfServiceWrapper /></Layout>} />
        
        {/* GO-AIBOB - NO Layout (has its own full-screen sidebar layout) */}
        <Route path="/go-aibob" element={<GoAibobIndex />} />

        {/* AI Blogs Studio - NO Layout (has its own header/footer) */}
        <Route path="/AIBlogsStudio" element={<AiBlogsStudio />} />
        <Route path="/ai-blogs-studio" element={<Navigate to="/AIBlogsStudio" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Wrap entire app with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
