import { apiUrl } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  FileText, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  Users
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

const DEFAULT_INSURANCE = {
  providerName: "Prime Health / MetLife Network",
  inpatientPercent: "100%",
  inpatientDesc: "Full 100% coverage at all Prime Health / MetLife network hospitals for surgical procedures, hospital stays, and emergency room care.",
  outpatientPercent: "85%",
  outpatientDesc: "85% coverage for doctor consultations, diagnostic lab tests, radiology, and prescribed pharmacy medications.",
  annualCap: "150,000 EGP",
  annualCapDesc: "Total annual health allowance per employee. Resets on January 1st every year.",
  claimsEmail: "health@xperience1st.com",
  claimDeadlineDays: "30 calendar days",
  emergencyPhone: "+20 (2) 2790-1123",
  reimbursementSteps: [
    "Request an itemized official receipt and medical diagnostic report stamped by the doctor/hospital.",
    "Submit scanned invoices within 30 days of treatment to health@xperience1st.com.",
    "Claims are reviewed by the Benefits team and credited with your monthly salary transfer upon insurer approval."
  ]
};

export default function Insurance() {
  const { sendMessage, setIsWidgetOpen } = useChat();
  const [insurance, setInsurance] = useState(DEFAULT_INSURANCE);
  const [isMetersAnimated, setIsMetersAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMetersAnimated(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch(apiUrl('/api/portal/content'))
      .then(res => res.json())
      .then(data => {
        if (data && data.insurance) {
          setInsurance(prev => ({ ...prev, ...data.insurance }));
        }
      })
      .catch(err => {
        console.warn('Using default insurance info:', err);
      });
  }, []);

  const handleAskAIAboutInsurance = () => {
    sendMessage(`How do I submit an out-of-network medical claim to ${insurance.claimsEmail} and what is the reimbursement limit?`);
    setIsWidgetOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-xperience-purple" />
            <span>Health & Medical Insurance Guide</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive medical coverage for Xperience1st employees.
          </p>
        </div>
      </div>

      {/* Blurred Container with Overlay Notice */}
      <div className="relative rounded-3xl overflow-hidden min-h-[480px]">
        
        {/* Centered Glassmorphic "Stay Tuned" Overlay */}
        {insurance.isRenewalNoticeActive !== false && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6 bg-slate-900/10 backdrop-blur-[2px]">
            <div className="bg-white/95 backdrop-blur-xl border border-purple-200/80 shadow-2xl rounded-3xl p-6 sm:p-10 max-w-xl text-center space-y-5 animate-fadeIn">
              
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#6C47C9] to-[#7B52DE] text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
                <HeartPulse className="w-8 h-8 animate-pulse" />
              </div>

              <div className="inline-flex items-center gap-2 bg-purple-50 text-xperience-purple px-3.5 py-1.5 rounded-full text-xs font-bold border border-purple-200/70">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Healthcare Contract Renewal In Progress</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {insurance.renewalTitle || "Stay Tuned! Exciting Coverage Updates Coming Soon"}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {insurance.renewalMessage || "We are currently finalizing a comprehensive corporate agreement with a brand-new medical insurance provider. As terms, direct billing networks, and digital claim cards are being finalized, previous coverage details are temporarily archived. Complete details will be unveiled here shortly!"}
              </p>

              <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-100 text-xs text-slate-700 flex items-center gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  For any immediate medical emergencies or urgent health support in the interim, please reach out directly to HR Operations at <a href={`mailto:${insurance.claimsEmail || 'hr@xperience1st.com'}`} className="font-bold text-xperience-purple hover:underline">{insurance.claimsEmail || 'hr@xperience1st.com'}</a>.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Content Container (Blurred when under renewal, active when cleared) */}
        <div className={`space-y-6 ${insurance.isRenewalNoticeActive !== false ? 'filter blur-md select-none pointer-events-none opacity-40' : 'animate-fadeIn'}`} aria-hidden={insurance.isRenewalNoticeActive !== false}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2.5">
              <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                Inpatient Coverage
              </span>
              <div className="text-3xl font-black text-slate-900">{insurance.inpatientPercent || '100%'}</div>
              {/* Animated Coverage Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  style={{ 
                    width: isMetersAnimated ? `${parseInt(insurance.inpatientPercent, 10) || 100}%` : '0%',
                    transition: 'width 1000ms cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full"
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {insurance.inpatientDesc || 'Full coverage at network hospitals for surgical procedures and emergency room care.'}
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2.5">
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Outpatient & Rx
              </span>
              <div className="text-3xl font-black text-slate-900">{insurance.outpatientPercent || '85%'}</div>
              {/* Animated Coverage Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  style={{ 
                    width: isMetersAnimated ? `${parseInt(insurance.outpatientPercent, 10) || 85}%` : '0%',
                    transition: 'width 1000ms cubic-bezier(0.16, 1, 0.3, 1) 120ms'
                  }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {insurance.outpatientDesc || 'Consultations, diagnostic lab tests, radiology, and prescribed pharmacy medications.'}
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2.5">
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                Annual Policy Cap
              </span>
              <div className="text-3xl font-black text-slate-900">{insurance.annualCap || '150,000 EGP'}</div>
              {/* Animated Coverage Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  style={{ 
                    width: isMetersAnimated ? '100%' : '0%',
                    transition: 'width 1000ms cubic-bezier(0.16, 1, 0.3, 1) 240ms'
                  }}
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {insurance.annualCapDesc || 'Total annual health allowance per employee. Resets annually.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Out-of-Network Claim Reimbursement
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reimbursement instructions, doctor diagnostic report submission, and claim turnaround.
              </p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Adding Family Dependents
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eligible enrollment windows for spouses and children under company medical plans.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
