import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { analytics } from './src/utils/analytics';

// Eager load only critical components
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import LoadingSpinner from './src/components/LoadingSpinner';

// Lazy load all page components for code splitting
const HomePage = lazy(() => import('./components/HomePage'));
const MenuPage = lazy(() => import('./components/MenuPage'));
const DashboardPlaceholder = lazy(() => import('./components/DashboardPlaceholder'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const PaymentCheckout = lazy(() => import('./components/PaymentCheckout'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const SignupPage = lazy(() => import('./components/SignupPage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const GoAibobIndex = lazy(() => import('./src/pages/GoAibob'));
const AiBlogsStudio = lazy(() => import('./src/pages/AiBlogsStudio'));
const AITestPage = lazy(() => import('./src/pages/AITestPage'));
const AIReviewDashboard = lazy(() => import('./src/pages/GoAibob/AIReviewDashboard'));
const AIMetricsDashboard = lazy(() => import('./src/pages/GoAibob/AIMetricsDashboard'));

// GO-AIBOB Admin
const AdminIndex = lazy(() => import('./src/pages/GoAibob/Admin'));
const HelpSupport = lazy(() => import('./src/pages/GoAibob/Admin/HelpSupport'));
const SitesManagement = lazy(() => import('./src/pages/GoAibob/Admin/SitesManagement'));
const ImportExport = lazy(() => import('./src/pages/GoAibob/Admin/ImportExport'));
const OrdersManagement = lazy(() => import('./src/pages/GoAibob/Admin/OrdersManagement'));
const AnalyticsDashboard = lazy(() => import('./src/pages/GoAibob/Admin/AnalyticsDashboard'));
const AdminSettings = lazy(() => import('./src/pages/GoAibob/Admin/AdminSettings'));

// GO-AIBOB Public Pages
const PublicLanding = lazy(() => import('./src/pages/GoAibob/Public/PublicLanding'));
const Features = lazy(() => import('./src/pages/GoAibob/Public/Features'));
const Pricing = lazy(() => import('./src/pages/GoAibob/Public/Pricing'));
const HowItWorks = lazy(() => import('./src/pages/GoAibob/Public/HowItWorks'));
const LoginPortal = lazy(() => import('./src/pages/GoAibob/Public/LoginPortal'));
const SignupPortal = lazy(() => import('./src/pages/GoAibob/Public/SignupPortal'));

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

// Main App component with routing and Suspense
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
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

          {/* GO-AIBOB Public Pages - NO Layout */}
          <Route path="/go-aibob" element={<PublicLanding />} />
          <Route path="/go-aibob/features" element={<Features />} />
          <Route path="/go-aibob/pricing" element={<Pricing />} />
          <Route path="/go-aibob/how-it-works" element={<HowItWorks />} />
          <Route path="/go-aibob/login" element={<LoginPortal />} />
          <Route path="/go-aibob/signup" element={<SignupPortal />} />

          {/* GO-AIBOB Admin - NO Layout (has its own sidebar layout) */}
          <Route path="/go-aibob/Admin" element={<AdminIndex />} />
          <Route path="/go-aibob/Admin/ai-test" element={<AITestPage />} />
          <Route path="/go-aibob/Admin/ai-review" element={<AIReviewDashboard />} />
          <Route path="/go-aibob/Admin/ai-metrics" element={<AIMetricsDashboard />} />
          <Route path="/go-aibob/Admin/sites" element={<SitesManagement />} />
          <Route path="/go-aibob/Admin/import" element={<ImportExport />} />
          <Route path="/go-aibob/Admin/orders" element={<OrdersManagement />} />
          <Route path="/go-aibob/Admin/analytics" element={<AnalyticsDashboard />} />
          <Route path="/go-aibob/Admin/settings" element={<AdminSettings />} />
          <Route path="/go-aibob/Admin/help" element={<HelpSupport />} />

          {/* Legacy AI Routes - Redirect to Admin */}
          <Route path="/ai-test" element={<AITestPage />} />
          <Route path="/ai-review" element={<AIReviewDashboard />} />
          <Route path="/ai-metrics" element={<AIMetricsDashboard />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
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

