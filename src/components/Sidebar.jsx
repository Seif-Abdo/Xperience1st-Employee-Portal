import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Award, 
  HeartPulse, 
  Building, 
  Network,
  Bot, 
  History,
  Sparkles,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function Sidebar({ activePage, setActivePage, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { sessions, setIsWidgetOpen } = useChat();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard & Hub', icon: LayoutDashboard },
    { id: 'policies', label: 'HR Policy Knowledge', icon: BookOpen },
    { id: 'leave', label: 'Leave Planner & Requests', icon: Calendar },
    { id: 'certifications', label: 'Salesforce Vouchers', icon: Award, badge: '100% Free' },
    { id: 'insurance', label: 'Medical & Insurance', icon: HeartPulse },
    { id: 'directory', label: 'Company & HR Contacts', icon: Building },
    { id: 'hierarchy', label: 'Company Hierarchy', icon: Network },
    { id: 'history', label: 'My Chat History', icon: History, count: sessions.length }
  ];

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        aria-label="Employee Workspace Navigation"
        className={`
        fixed lg:sticky top-16 z-40 lg:z-30 
        h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)]
        w-[82vw] max-w-[320px] lg:w-64 bg-white 
        border-r border-slate-200/90
        shadow-2xl lg:shadow-none
        rounded-r-2xl lg:rounded-none
        transition-transform duration-300 ease-out shrink-0
        overflow-y-auto overscroll-contain
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col justify-between min-h-full p-4 pb-24 lg:pb-6 space-y-4">
          
          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Portal sections">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Employee Workspace
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold
                    transition-all group text-left
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#6C47C9] to-[#7B52DE] text-white shadow-md shadow-xperience-purple/20' 
                      : item.isHighlighted
                        ? 'text-xperience-purple hover:bg-purple-50 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.isHighlighted ? 'text-xperience-purple' : 'text-slate-400 group-hover:text-slate-700'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-xperience-purple'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Card: AI Assistant Quick Spotlight */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Xperience1st HR Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Instant answers on working hours, insurance terms & company guidelines.
              </p>
              <button
                onClick={() => {
                  setIsWidgetOpen(true);
                  if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className="text-[11px] font-bold text-xperience-lightPurple hover:text-white flex items-center gap-1 transition-colors pt-1 cursor-pointer"
              >
                <span>Open Xperience1st Assistant</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="text-[11px] text-slate-400 text-center pb-2">
              Xperience1st Employee Portal
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
