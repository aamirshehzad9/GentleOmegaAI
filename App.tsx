
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import DashboardPlaceholder from './components/DashboardPlaceholder';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'menu':
        return <MenuPage />;
      case 'dashboard':
        return <DashboardPlaceholder />;
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
    </div>
  );
};

export default App;
