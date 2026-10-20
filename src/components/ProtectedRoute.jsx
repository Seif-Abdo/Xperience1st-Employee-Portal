import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6C47C9] to-[#7B52DE] flex items-center justify-center shadow-lg shadow-purple-900/50 animate-pulse">
          <span className="text-white font-black text-xl">XP</span>
        </div>
        <div className="flex items-center gap-2 text-purple-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-xperience-purple animate-ping"></span>
          Verifying Xperience1st Employee Credentials...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
}
