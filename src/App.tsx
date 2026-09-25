import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { NewOrderView } from './components/NewOrderView';
import { OrdersTrackerView } from './components/OrdersTrackerView';
import { AddFundsView } from './components/AddFundsView';
import { AddFundsModal } from './components/AddFundsModal';
import { AnalyticsView } from './components/AnalyticsView';
import { ServicesView } from './components/ServicesView';
import { MassOrderView } from './components/MassOrderView';
import { TikTokCalculatorView } from './components/TikTokCalculatorView';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-cyan-500/20 selection:text-cyan-600">
      {/* Top Navigation */}
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Container with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Navigation Sidebar */}
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {activeTab === 'order' && <NewOrderView />}
          {activeTab === 'tracker' && <OrdersTrackerView />}
          {activeTab === 'funds' && <AddFundsView />}
          {activeTab === 'services' && <ServicesView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'mass_order' && <MassOrderView />}
          {activeTab === 'calculator' && <TikTokCalculatorView />}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Quick Deposit Modal */}
      <AddFundsModal />

      {/* Real-time Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
