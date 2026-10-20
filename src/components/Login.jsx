import { apiUrl } from '../api';
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Lock, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/auth/google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.error || 'Access restricted. Only verified @xperience1st.com accounts are permitted.');
      }
    } catch (err) {
      setError('Connection to authentication server failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed or was closed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#6C47C9]/25 to-[#7B52DE]/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C47C9] via-[#6A41C9] to-[#7B52DE] text-white mx-auto flex items-center justify-center font-black text-2xl shadow-xl shadow-purple-900/40">
            XP
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Xperience1st Employee Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Internal Company Policies & AI HR Assistant
            </p>
          </div>
        </div>

        {/* Informational Notice */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-2 text-xs">
          <div className="text-slate-300 font-semibold flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-xperience-lightPurple" />
            <span>Authorized Employees Only</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Sign in with your official corporate Google account ending with <strong className="text-purple-300">@xperience1st.com</strong> to access company policies and the HR Assistant.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Google SSO Container */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          {isLoading ? (
            <div className="flex items-center gap-2 text-purple-300 text-xs py-4">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting to Google SSO...</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="pill"
              size="large"
              text="signin_with"
              logo_alignment="center"
              width="300"
            />
          )}
        </div>

        {/* Security badges */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Google Workspace Verified</span>
          </div>
          <span>256-Bit SSL</span>
        </div>

      </div>

      <div className="text-[11px] text-slate-500 mt-6 text-center z-10">
        © 2026 Xperience1st • Salesforce & Cloud Consulting Partner
      </div>

    </div>
  );
}
