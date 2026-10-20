import { apiUrl } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Calendar, 
  HeartPulse, 
  TrendingUp, 
  Laptop, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

const DEFAULT_POLICIES = [
  {
    id: 'vacations_and_leave',
    category: 'leave',
    title: 'Vacations and Leave Policy',
    badge: '15 / 21 / 30 Days',
    summary: '15 days in year 1, 21 days after 1 year, 30 days for 10+ yrs or age 50+. 7 casual days. First 3 sick days fully paid.',
    details: 'Annual Leave provides 15 days in the first year, 21 days after completing 1 full year, and 30 days for 10+ years tenure or age 50+. Requests for 1–2 days require at least 3 working days notice; longer leaves (>2 days) require at least 7 working days notice. Max 5 consecutive days without special approval. Up to 5 unused days roll over to next year. Casual leave offers up to 7 days/year (max 2 per quarter). Sick leave: first 3 days per year are 100% paid.',
    botQuery: '🏖️ Annual leave rules, carry over, and notice requirements'
  },
  {
    id: 'extended_wfh',
    category: 'hours',
    title: 'Extended WFH Policy (Non-Cairo & Giza)',
    badge: '+1 WFH Day/Week',
    summary: 'Team members residing outside Cairo and Giza are eligible for 1 additional Work From Home day per week.',
    details: 'To promote work-life balance and reduce commuting challenges, team members whose official residence is outside Cairo and Giza receive 1 additional WFH day per week, in addition to standard hybrid work rules, coordinated with direct manager and aligned with team deliverables.',
    botQuery: '🏠 Extended WFH rules for employees outside Cairo & Giza'
  },
  {
    id: 'working_hours',
    category: 'hours',
    title: 'Working Hours & Attendance',
    badge: '9 AM - 5 PM (Sun-Thu)',
    summary: 'Sunday to Thursday, 9:00 AM - 5:00 PM. Flexibility encouraged while maintaining responsiveness and deliverable quality.',
    details: 'Official operating hours are 9:00 AM – 5:00 PM, Sunday through Thursday. Flexibility is encouraged as long as work is delivered and aligned with team needs. Remote workers must maintain stable connectivity and responsiveness during business hours.',
    botQuery: '⏰ Official working hours and attendance expectations'
  },
  {
    id: 'probation_policy',
    category: 'talent',
    title: 'Probation Period & Review Policy',
    badge: '3 Months Initial',
    summary: 'Structured 3-month probation with mid-probation check-in and formal evaluation 10 days before completion.',
    details: 'All new hires undergo an initial 3-month probation period. Managers conduct a mid-probation review. Ten (10) days before completion, HR initiates the final evaluation form. If performance is unsatisfactory, employment may be terminated with 7 days written notice as per Egyptian Labor Law.',
    botQuery: '📋 Probation period timeline and evaluation process'
  },
  {
    id: 'compensation_profit_share',
    category: 'compensation',
    title: 'Compensation & Profit Share Policy',
    badge: 'Annual March Cycle',
    summary: 'Annual salary reviews effective in March. Profit share pool up to 3 months net annual profit distributed Feb–March.',
    details: 'Salary reviews take place once per year, effective in the March payroll cycle (eligibility requires at least 6 months of active service). Company financial year runs Feb 1 to Jan 31. Up to 3 months of net annual profit is allocated to the Profit Share Pool, distributed between February and March.',
    botQuery: '💰 Salary review cycle and profit sharing eligibility'
  },
  {
    id: 'team_engagement_budget',
    category: 'culture',
    title: 'Team Engagement & Recognition Budget',
    badge: 'Monthly Team Fund',
    summary: 'Monthly dedicated budget per team for Team Leaders to organize outings, milestones, appreciation, and team bonding.',
    details: 'Team Leaders are allocated an autonomous monthly budget based on team size for team building activities, achievement recognition gifts, birthday celebrations, and team lunches. No prior approval needed within budget; simple receipts coordinated with Accounting.',
    botQuery: '🎉 Team engagement budget usage and guidelines'
  },
  {
    id: 'travel_request_process',
    category: 'operations',
    title: 'Business Travel Request Process',
    badge: '3 Weeks Advance',
    summary: 'Submit travel requests at least 3 weeks before travel date. Operations handles flights, hotels, and per diem pocket money.',
    details: 'All business travel requests must be submitted at least three (3) weeks in advance by the direct manager. Designated Operations team manages bookings for flights, accommodation, and transportation, along with standardized daily per diem pocket money.',
    botQuery: '✈️ Business travel booking process and per diem rules'
  },
  {
    id: 'workplace_dress_property',
    category: 'workplace',
    title: 'Workplace, Dress Code & Property',
    badge: 'Smart Casual',
    summary: 'Smart casual dress code, clean shared spaces, smoke-free indoor policy, and responsible device stewardship.',
    details: 'Professional smart casual attire is standard; business formal for client meetings. Smoking and vaping are strictly prohibited indoors. Team members are expected to maintain clean workstations, respect meeting room schedules, and protect company-assigned IT hardware.',
    botQuery: '👔 Dress code expectations and company property rules'
  },
  {
    id: 'complaint_procedure',
    category: 'hr',
    title: 'Complaint & Grievance Procedure',
    badge: '5-Step Resolution',
    summary: 'Fair 5-step escalation: Manager discussion, HR written complaint in 7 days, investigation, decision, and appeal.',
    details: 'Xperience1st enforces a strict zero-retaliation policy. Step 1: Formal discussion with manager. Step 2: Written complaint to HR within 7 days. Step 3: Investigation within 7 business days. Step 4: Written decision within 7 business days. Step 5: Appeal to Senior Management within 14 days. Sensitive matters (harassment/discrimination) can bypass Step 1 directly to HR.',
    botQuery: '⚖️ How to submit a formal complaint or grievance'
  },
  {
    id: 'library_borrowing',
    category: 'learning',
    title: 'Library Usage & Book Borrowing',
    badge: '1 Book / 2 Weeks',
    summary: 'Borrow up to 1 book for 2 weeks from the internal library. Simple tracking via WhatsApp / internal log.',
    details: 'To encourage continuous learning, our internal library offers curated technical and professional books. Team members may borrow 1 book at a time for up to 2 weeks on a first-come, first-served basis.',
    botQuery: '📚 How to borrow books from the office library'
  },
  {
    id: 'offboarding_policy',
    category: 'hr',
    title: 'Resignation & Offboarding Policy',
    badge: '2 Months Notice',
    summary: '2 months resignation notice for knowledge handover. Clearance form, property return, and return of original documents.',
    details: 'Resignation requires official written email with a 2-month notice period to ensure thorough project and task handover. Offboarding covers knowledge transfer, return of all hardware and access badges, clearance form signing, and return of employee original personal documents by HR.',
    botQuery: '📦 Resignation notice period and offboarding steps'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Policies' },
  { id: 'leave', label: 'Leave & Attendance' },
  { id: 'hours', label: 'Workplace & Remote' },
  { id: 'talent', label: 'Talent & Onboarding' },
  { id: 'compensation', label: 'Compensation & Benefits' },
  { id: 'culture', label: 'Culture & Engagement' },
  { id: 'operations', label: 'Operations & Travel' },
  { id: 'workplace', label: 'Workplace & Conduct' },
  { id: 'learning', label: 'Learning & Library' },
  { id: 'hr', label: 'HR & Grievance' }
];

export default function Policies({ setActivePage }) {
  const { sendMessage, setIsWidgetOpen } = useChat();
  const [policiesList, setPoliciesList] = useState(DEFAULT_POLICIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedPolicy, setExpandedPolicy] = useState('working_hours');

  useEffect(() => {
    fetch(apiUrl('/api/portal/content'))
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.policies) && data.policies.length > 0) {
          setPoliciesList(data.policies);
        }
      })
      .catch(err => {
        console.warn('Using default policies (offline or server sync):', err);
      });
  }, []);

  const getPolicyIcon = (cat) => {
    switch (cat) {
      case 'hours': return Clock;
      case 'leave': return Calendar;
      case 'benefits': return HeartPulse;
      case 'it': return Laptop;
      case 'hr': return ShieldCheck;
      default: return BookOpen;
    }
  };

  const filteredPolicies = policiesList.filter(policy => {
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (policy.title || '').toLowerCase().includes(q) ||
      (policy.summary || '').toLowerCase().includes(q) ||
      (typeof policy.details === 'string' 
        ? policy.details.toLowerCase().includes(q) 
        : Array.isArray(policy.details) && policy.details.some(d => d.toLowerCase().includes(q)));
    return matchesCategory && matchesSearch;
  });

  const handleAskAI = (prompt) => {
    sendMessage(prompt || "Can you explain this company policy in detail?");
    setIsWidgetOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-xperience-purple" />
            <span>Official HR Policy Knowledge Base</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative guidelines, benefits allowances, and working rules for Xperience1st employees.
          </p>
        </div>

        <button
          onClick={() => handleAskAI("Show me company policy highlights")}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C47C9] to-[#7B52DE] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-xperience-purple/20 hover:opacity-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search policies (e.g. leave notice, insurance claims, remote days, laptop setup)..."
            aria-label="Search corporate policies"
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-[16px] sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-xperience-purple focus:ring-2 focus:ring-purple-100 shadow-2xs transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x" role="toolbar" aria-label="Policy categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-xperience-purple text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Accordion Cards */}
      <div className="space-y-3">
        {filteredPolicies.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No matching policies found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or ask the AI Assistant directly.
            </p>
          </div>
        ) : (
          filteredPolicies.map((policy) => {
            const Icon = getPolicyIcon(policy.category);
            const isExpanded = expandedPolicy === policy.id;

            return (
              <div
                key={policy.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all hover:border-slate-300"
              >
                {/* Header row */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-controls={`policy-details-${policy.id}`}
                  onClick={() => setExpandedPolicy(isExpanded ? null : policy.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setExpandedPolicy(isExpanded ? null : policy.id);
                    }
                  }}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-inset transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-xperience-purple flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                          {policy.title}
                        </h2>
                        {policy.badge && (
                          <span className="text-[10px] font-bold bg-purple-50 text-xperience-purple px-2 py-0.5 rounded-md">
                            {policy.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {policy.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div id={`policy-details-${policy.id}`} className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/40 space-y-4">
                    {Array.isArray(policy.details) ? (
                      <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                        {policy.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-xperience-purple shrink-0 mt-1.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {policy.details}
                      </p>
                    )}

                    {/* Ask AI CTA */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                      <span className="text-[11px] text-slate-500">
                        Need clarification on this policy?
                      </span>
                      <button
                        onClick={() => handleAskAI(policy.botQuery || policy.aiPrompt)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-xperience-purple hover:text-xperience-darkPurple bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ask AI about this →</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
