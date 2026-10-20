import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Send,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export default function Certifications() {
  const { user } = useAuth();
  const { sendMessage, setIsWidgetOpen } = useChat();

  const [selectedCert, setSelectedCert] = useState('sf_ai');
  const [targetExamDate, setTargetExamDate] = useState('');
  const [managerApprovalConfirmed, setManagerApprovalConfirmed] = useState(false);
  const [submittedVoucher, setSubmittedVoucher] = useState(null);

  const VOUCHERS = [
    {
      id: 'sf_ai',
      title: 'Salesforce Certified AI Specialist',
      track: 'Salesforce AI & Data Cloud',
      level: 'Specialist',
      sponsorship: '100% Covered ($200 USD)',
      studyLeave: '1 Paid Day on Exam Date',
      description: 'Covers generative AI prompts, Einstein Copilot, Einstein 1 Studio, and AI safety guardrails.'
    },
    {
      id: 'sf_admin',
      title: 'Salesforce Certified Administrator',
      track: 'Core CRM Platform',
      level: 'Foundational',
      sponsorship: '100% Covered ($200 USD)',
      studyLeave: '1 Paid Day on Exam Date',
      description: 'Foundational certification covering Sales Cloud, Service Cloud, workflow automation, and security models.'
    },
    {
      id: 'sf_pdi',
      title: 'Salesforce Platform Developer I (PDI)',
      track: 'Apex & LWC Development',
      level: 'Developer',
      sponsorship: '100% Covered ($200 USD)',
      studyLeave: '1 Paid Day on Exam Date',
      description: 'Custom business logic using Apex triggers, SOQL queries, and modern Lightning Web Components.'
    },
    {
      id: 'sf_arch',
      title: 'Salesforce Application Architect',
      track: 'Enterprise Architecture',
      level: 'Architect',
      sponsorship: '100% Covered ($400 USD)',
      studyLeave: '1 Paid Day on Exam Date',
      description: 'Comprehensive domain covering Data Architecture & Management Designer and Sharing & Visibility.'
    },
    {
      id: 'aws_arch',
      title: 'AWS Certified Solutions Architect - Associate',
      track: 'Cloud Infrastructure',
      level: 'Associate',
      sponsorship: '100% Covered ($150 USD)',
      studyLeave: '1 Paid Day on Exam Date',
      description: 'High-availability architectures, serverless computing, VPC networking, and cloud security.'
    },
    {
      id: 'mule_dev',
      title: 'MuleSoft Certified Developer - Level 1',
      track: 'API Integration',
      level: 'Integration',
      sponsorship: '100% Covered ($250 USD)',
      studyLeave: '1 Paid Day on Exam Date',
      description: 'API-led connectivity, DataWeave transformations, and Anypoint Platform implementations.'
    }
  ];

  const handleRequestVoucher = (e) => {
    e.preventDefault();
    if (!managerApprovalConfirmed) return;

    const certObj = VOUCHERS.find(v => v.id === selectedCert);
    setSubmittedVoucher({
      cert: certObj,
      targetDate: targetExamDate,
      reqId: `VOUCHER-${Math.floor(100000 + Math.random() * 900000)}`
    });

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleAskAIAboutVouchers = () => {
    sendMessage("What is the exact policy for Salesforce exam voucher sponsorship, study material reimbursement, and exam study leave at Xperience1st?");
    setIsWidgetOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-xperience-purple" />
            <span>Salesforce & Cloud Certification Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Xperience1st sponsors 100% of certification exam fees for Salesforce, AWS, and MuleSoft credentials.
          </p>
        </div>

        <button
          onClick={handleAskAIAboutVouchers}
          className="inline-flex items-center gap-2 text-xs font-bold text-xperience-purple bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Voucher Rules</span>
        </button>
      </div>

      {/* Policy Highlights Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-purple-950 text-white rounded-3xl p-6 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <div className="text-amber-400 font-extrabold text-sm flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>100% Fee Sponsorship</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All primary and advanced exam vouchers are paid for directly by Xperience1st upon manager approval.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-purple-300 font-extrabold text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>1 Paid Study Leave Day</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Employees are granted 1 full day of paid study leave on the day of the exam to focus and prepare.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-emerald-400 font-extrabold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Recognition Badge & Bonus</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Official recognition badges awarded, plus study material reimbursements upon passing verification.
          </p>
        </div>
      </div>

      {/* Catalog & Request Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Catalog Column */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Sponsored Certification Catalog
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {VOUCHERS.map(v => (
              <div
                key={v.id}
                onClick={() => setSelectedCert(v.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedCert === v.id
                    ? 'bg-purple-50/60 border-xperience-purple shadow-sm'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">{v.title}</h3>
                      <span className="text-[10px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                        {v.level}
                      </span>
                    </div>
                    <div className="text-[11px] text-xperience-purple font-semibold mt-0.5">
                      {v.track}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {v.description}
                    </p>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                    {v.sponsorship}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voucher Request Column */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Voucher Request Simulator
          </h2>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            {submittedVoucher ? (
              <div className="text-center py-6 space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Voucher Request Simulated!
                  </h3>
                  <p className="text-xs text-slate-600 font-mono">
                    Ref ID: {submittedVoucher.reqId}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs space-y-2 border border-slate-200">
                  <div className="text-slate-500">Applicant: <strong className="text-slate-900">{user?.name}</strong></div>
                  <div className="text-slate-500">Exam: <strong className="text-slate-900">{submittedVoucher.cert.title}</strong></div>
                  <div className="text-slate-500">Target Date: <strong className="text-slate-900">{submittedVoucher.targetDate}</strong></div>
                  <div className="text-slate-500">Sponsorship: <strong className="text-emerald-700">{submittedVoucher.cert.sponsorship}</strong></div>
                </div>

                <button
                  onClick={() => setSubmittedVoucher(null)}
                  className="text-xs font-bold text-xperience-purple hover:underline"
                >
                  Submit Another Voucher Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestVoucher} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selected Certification</label>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900">
                    {VOUCHERS.find(v => v.id === selectedCert)?.title}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Exam Date</label>
                  <input
                    type="date"
                    value={targetExamDate}
                    onChange={(e) => setTargetExamDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-xperience-purple"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Your 1 paid study leave day will be scheduled on this date.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="managerApproval"
                    checked={managerApprovalConfirmed}
                    onChange={(e) => setManagerApprovalConfirmed(e.target.checked)}
                    required
                    className="mt-1 rounded text-xperience-purple focus:ring-purple-400"
                  />
                  <label htmlFor="managerApproval" className="text-xs text-slate-600 leading-tight">
                    I confirm that I have discussed this certification goal with my direct practice lead.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!managerApprovalConfirmed}
                  className="w-full bg-gradient-to-r from-[#6C47C9] to-[#7B52DE] disabled:opacity-40 hover:opacity-95 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-xperience-purple/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Request Sponsored Voucher</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
