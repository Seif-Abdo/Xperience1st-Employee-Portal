import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Policies from './pages/Policies';
import LeavePlanner from './pages/LeavePlanner';
import Certifications from './pages/Certifications';
import Insurance from './pages/Insurance';
import Directory from './pages/Directory';
import HierarchyPage from './pages/Hierarchy';
import HistoryPage from './pages/History';

function PortalContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reset window scroll when switching pages
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activePage]);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'policies':
        return <Policies setActivePage={setActivePage} />;
      case 'leave':
        return <LeavePlanner setActivePage={setActivePage} />;
      case 'certifications':
        return <Certifications setActivePage={setActivePage} />;
      case 'insurance':
        return <Insurance setActivePage={setActivePage} />;
      case 'directory':
        return <Directory setActivePage={setActivePage} />;
      case 'hierarchy':
        return <HierarchyPage setActivePage={setActivePage} />;
      case 'history':
        return <HistoryPage setActivePage={setActivePage} />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col selection:bg-purple-100 selection:text-xperience-purple">
      
      {/* Top Fixed Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Body Layout with pt-16 for Fixed Header Offset */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pt-16">
        
        {/* Sidebar */}
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Dynamic Page Content with Generous Bottom Clearance for Mobile Toolbars & Hosted Chatbot */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-32 sm:pb-16">
          {renderActivePage()}
        </main>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 px-4 text-xs text-slate-500 mt-auto pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">XPERIENCE1ST</span>
            <span>•</span>
            <span>Internal Employee Hub & AI Policy Assistant</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Corporate Employee Portal</span>
            <span>•</span>
            <span>© 2026 Xperience1st. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ProtectedRoute>
          <PortalContent />
        </ProtectedRoute>
      </ChatProvider>
    </AuthProvider>
  );
}
