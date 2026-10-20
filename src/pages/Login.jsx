import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertCircle
} from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth, ALLOWED_DOMAIN } from '../context/AuthContext';

export default function Login() {
  const { loginWithGoogle, loginAsPreview, error, setError, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#6C47C9]/30 to-[#7B52DE]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-900/10 blur-[90px] rounded-full pointer-events-none" />

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C47C9] via-[#6A41C9] to-[#7B52DE] text-white mx-auto flex items-center justify-center font-black text-2xl shadow-xl shadow-purple-900/50">
            XP
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Xperience1st Employee Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Internal HR Policies, Self-Service & AI Assistant
            </p>
          </div>

          {/* Domain Restriction Pill */}
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Restricted to @{ALLOWED_DOMAIN} accounts</span>
          </div>
        </div>

        {/* Informational Guidance */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1.5 text-xs">
          <div className="text-slate-300 font-semibold flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Corporate Single Sign-On</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Please authenticate using your official company Google Workspace account (<strong className="text-purple-300">@{ALLOWED_DOMAIN}</strong>) to access company resources.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Google SSO Action Area */}
        <div className="space-y-4 pt-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2.5">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-purple-300 font-medium">Authenticating with Google Workspace...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <GoogleLogin
                onSuccess={(cred) => loginWithGoogle(cred.credential)}
                onError={() => setError('Google Sign-In failed or was closed. Please try again.')}
                theme="filled_black"
                shape="pill"
                size="large"
                text="signin_with"
                logo_alignment="center"
                width="320"
              />
            </div>
          )}
        </div>

        {/* Local Preview Access Button for Instant Inspection */}
        <div className="pt-2 text-center space-y-2">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">or local inspection</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>
          <button
            type="button"
            onClick={() => loginAsPreview()}
            className="w-full bg-gradient-to-r from-[#6C47C9] to-[#7B52DE] hover:opacity-95 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>⚡ Enter Local Preview Mode (Waleed Sharawy)</span>
          </button>
        </div>

        {/* Security / Trust Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            256-Bit Encrypted Portal
          </span>
          <span>Xperience1st Internal Hub</span>
        </div>

      </div>

      <div className="text-[11px] text-slate-500 mt-6 text-center z-10">
        © 2026 Xperience1st • Salesforce & Cloud Consulting Partner
      </div>

    </div>
  );
}
