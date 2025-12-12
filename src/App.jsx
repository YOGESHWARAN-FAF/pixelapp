
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ConnectionPage from './pages/ConnectionPage';
import MatrixSettingsPage from './pages/MatrixSettingsPage';
import SimulatorPage from './pages/SimulatorPage';
import TextPage from './pages/TextPage';
import DesignPage from './pages/DesignPage';
import ComboPage from './pages/ComboPage';
import LogsPage from './pages/LogsPage';
import AboutPage from './pages/AboutPage';
import AiDesignerPage from './pages/AiDesignerPage';
import './index.css';

const AppContent = () => {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage onNavigate={setActivePage} />;
      case 'connection': return <ConnectionPage />;
      case 'settings': return <MatrixSettingsPage />;
      case 'simulator': return <SimulatorPage />;
      case 'text': return <TextPage />;
      case 'design': return <DesignPage />;
      case 'combo': return <ComboPage />;
      case 'logs': return <LogsPage />;
      case 'ai-designer': return <AiDesignerPage />;
      case 'about': return <AboutPage />;
      default: return <HomePage onNavigate={setActivePage} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
