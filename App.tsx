
import React, { useState, useCallback } from 'react';
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
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    // GO-AIBOB route
    if (currentPage === 'go-aibob') {
      return <GoAibobIndex />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'menu':
        return <MenuPage />;
      case 'dashboard':
        return <DashboardPlaceholder />;
      case 'admin':
        return <AdminDashboard navigate={navigate} />;
      case 'checkout':
        return <PaymentCheckout navigate={navigate} />;
      case 'login':
        return <LoginPage navigate={navigate} />;
      case 'signup':
        return <SignupPage navigate={navigate} />;
      case 'profile':
        return <ProfilePage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen">
      <Header navigate={navigate} currentPage={currentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer navigate={navigate} />
      
      {/* Live Chat Widget - Always visible */}
      <ChatWidget />
    </div>
  );
};

export default App;
