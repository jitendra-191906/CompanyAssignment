import React, { useEffect } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { TransactionsSection } from './components/TransactionsSection';
import { InsightsSection } from './components/InsightsSection';

const DashboardContent: React.FC = () => {
  const { darkMode } = useDashboard();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="app">
      <div className="app__header">
        <Header />
      </div>
      
      <main className="app__content">
        <div className="app__container">
          {/* Dashboard Overview */}
          <section className="app__section">
            <DashboardOverview />
          </section>

          {/* Insights */}
          <section className="app__section">
            <InsightsSection />
          </section>

          {/* Transactions */}
          <section className="app__section">
            <TransactionsSection />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="app__footer">
        <p className="app__footer-text">
          © 2024 Finance Dashboard. Built with React & TypeScript.
        </p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export default App;
