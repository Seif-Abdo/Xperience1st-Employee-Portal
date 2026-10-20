import React from 'react';
import { 
  Building2, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export default function Navbar({ activePage, setActivePage, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { user, logout, allowedDomain } = useAuth();
  const { setIsWidgetOpen } = useChat();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
                isMobileMenuOpen 
                  ? 'bg-gradient-to-r from-[#6C47C9] to-[#7B52DE] text-white shadow-md ring-2 ring-purple-300 font-bold scale-105' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2]" />}
            </button>

            <div 
              role="button"
              tabIndex={0}
              aria-label="Return to Home Dashboard"
              onClick={() => setActivePage('dashboard')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActivePage('dashboard'); } }}
              className="flex flex-col sm:flex-row sm:items-center sm:gap-3 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg p-1"
            >
              <img 
                src="/logo.png" 
                alt="Xperience1st" 
                className="h-6 sm:h-8 w-auto object-contain" 
              />
              <span className="text-[9px] sm:text-xs font-bold sm:font-semibold text-slate-500 uppercase tracking-wider sm:border-l sm:border-slate-300 sm:pl-3 leading-tight mt-0.5 sm:mt-0">
                Employee Portal
              </span>
            </div>
          </div>

          {/* Right: User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Quick Ask AI Button */}
            <button
              onClick={() => setIsWidgetOpen(prev => !prev)}
              aria-label="Toggle AI HR Assistant Widget"
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] bg-gradient-to-r from-[#6C47C9] to-[#7B52DE] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-xperience-purple/20 hover:opacity-95 transition-all transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask HR AI</span>
            </button>

            {/* Employee Profile Pill */}
            {user && (
              <div 
                className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200/70 transition-colors p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 min-h-[44px]"
                aria-label={`Logged in as ${user.name}`}
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-xperience-purple/30"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6C47C9] to-[#7B52DE] text-white flex items-center justify-center font-bold text-xs">
                    {(user.name || 'E').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {user.name}
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors active:scale-95"
              title="Sign Out"
              aria-label="Sign Out of Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
