import { apiUrl } from '../api';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Info, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const DEFAULT_LEAVE_RULES = {
  annualDaysYearOne: 15,
  annualDays: 21,
  annualDaysSenior: 30,
  sickDays: 3,
  casualDays: 7,
  noticeDaysShort: 3,
  noticeDaysLong: 7,
  noticeDaysRequired: 7,
  noticeRuleSummary: 'Requests must be submitted at least 3 working days in advance for short leave (1–2 days), and at least 7 working days in advance for leaves exceeding 2 days.',
  sickPolicy: 'First 3 sick days per year are 100% fully paid. Subsequent sick days follow labor law entitlements. Medical note required for absences over 2 days.',
  casualPolicy: 'Up to 7 days per year (deducted from annual balance, max 2 days per quarter). Notify manager and HR within the first hour of workday.'
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function LeavePlanner() {
  const { user } = useAuth();
  const { sendMessage, setIsWidgetOpen } = useChat();

  const [leaveRules, setLeaveRules] = useState(DEFAULT_LEAVE_RULES);
  const [targetDate, setTargetDate] = useState('');
  const [calculatedNotice, setCalculatedNotice] = useState(null);
  const [isMetersAnimated, setIsMetersAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMetersAnimated(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Custom Calendar Picker State
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const handleSelectToday = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setCalMonth(now.getMonth());
    setCalYear(now.getFullYear());
    handleCalculateNotice(todayStr);
    setIsCalendarOpen(false);
  };

  const handleClearDate = () => {
    handleCalculateNotice('');
    setIsCalendarOpen(false);
  };

  // Generate calendar days grid
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

  const prevMonthDays = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push({
      day: daysInPrevMonth - i,
      month: calMonth === 0 ? 11 : calMonth - 1,
      year: calMonth === 0 ? calYear - 1 : calYear,
      isCurrentMonth: false
    });
  }

  const currentMonthDays = [];
  for (let d = 1; d <= daysInMonth; d++) {
    currentMonthDays.push({
      day: d,
      month: calMonth,
      year: calYear,
      isCurrentMonth: true
    });
  }

  const totalDisplayed = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalDisplayed % 7 === 0 ? 0 : 7 - (totalDisplayed % 7);
  const nextMonthDays = [];
  for (let d = 1; d <= nextMonthDaysCount; d++) {
    nextMonthDays.push({
      day: d,
      month: calMonth === 11 ? 0 : calMonth + 1,
      year: calMonth === 11 ? calYear + 1 : calYear,
      isCurrentMonth: false
    });
  }

  const allCalendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  const now = new Date();
  const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    fetch(apiUrl('/api/portal/content'))
      .then(res => res.json())
      .then(data => {
        if (data && data.leaveRules) {
          setLeaveRules(prev => ({ ...prev, ...data.leaveRules }));
        }
      })
      .catch(err => {
        console.warn('Using default leave rules:', err);
      });
  }, []);

  const handleCalculateNotice = (dateStr) => {
    setTargetDate(dateStr);
    if (!dateStr) {
      setCalculatedNotice(null);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const requiredDays = Number(leaveRules.noticeDaysRequired) || 3;

    const deadlineDate = new Date(target);
    deadlineDate.setDate(deadlineDate.getDate() - requiredDays);

    setCalculatedNotice({
      daysAhead: diffDays,
      isCompliant: diffDays >= requiredDays,
      requiredDays,
      deadlineFormatted: deadlineDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    });
  };

  const handleAskAIAboutLeave = (topic) => {
    sendMessage(topic || "Can you explain the annual leave notice requirements and sick leave documentation rules?");
    setIsWidgetOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-xperience-purple" />
            <span>Leave Policy & Notice Guidelines</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official company entitlements, leave categories, and advance notice compliance rules.
          </p>
        </div>

        <button
          onClick={() => handleAskAIAboutLeave()}
          className="inline-flex items-center gap-2 text-xs font-bold text-xperience-purple bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Leave Assistant</span>
        </button>
      </div>

      {/* Leave Entitlement Overview Cards (Pure Policy - Managed by HR) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual Paid Leave</span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
              Standard
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {leaveRules.annualDays} Business Days
          </div>
          {/* Animated Entitlement Meter */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              style={{ 
                width: isMetersAnimated ? '100%' : '0%',
                transition: 'width 1000ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Full-time employees receive 15 days in Year 1, increasing to {leaveRules.annualDays} days after 1 year, and {leaveRules.annualDaysSenior} days for 10+ years tenure or age 50+. Max 5 consecutive days without special approval. Up to 5 days roll over to next year.
          </p>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-xperience-purple" />
            <span>Notice: 7 working days for &gt; 2 days (3 days for 1–2 days)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Casual Leave</span>
            <span className="text-[10px] font-bold bg-purple-50 text-xperience-purple px-2 py-0.5 rounded">
              Short Emergency
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            Up to {leaveRules.casualDays} Days
          </div>
          {/* Animated Entitlement Meter */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              style={{ 
                width: isMetersAnimated ? `${Math.min(100, (Number(leaveRules.casualDays) / 7) * 100)}%` : '0%',
                transition: 'width 1000ms cubic-bezier(0.16, 1, 0.3, 1) 120ms'
              }}
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
            />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {leaveRules.casualPolicy}
          </p>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>Max 2 days/quarter • Notify by 9:00 AM</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sick Leave</span>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded">
              Paid Entitlement
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {leaveRules.sickDays} Days 100% Paid
          </div>
          {/* Animated Entitlement Meter */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              style={{ 
                width: isMetersAnimated ? `${Math.min(100, (Number(leaveRules.sickDays) / 3) * 100)}%` : '0%',
                transition: 'width 1000ms cubic-bezier(0.16, 1, 0.3, 1) 240ms'
              }}
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
            />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {leaveRules.sickPolicy}
          </p>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>Doctor note required if &gt; 2 days</span>
          </div>
        </div>

      </div>

      {/* Advance Notice Rule Matrix & Interactive Compliance Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Advance Notice Rule Guidelines */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-xperience-purple" />
            <span>Advance Notice Rule Matrix</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Longer Leave (Exceeding 2 Days)
              </div>
              <p className="text-slate-600 leading-relaxed">
                Must be requested at least <strong>7 working days in advance</strong> to allow project and consulting coverage.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Short Leave (1 to 2 Days)
              </div>
              <p className="text-slate-600 leading-relaxed">
                Requires at least <strong>3 working days advance notice</strong> to your direct manager.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Emergency Casual & Sick Absences
              </div>
              <p className="text-slate-600 leading-relaxed">
                Notify your direct manager and HR within the <strong>first hour of the workday</strong>. Medical note required if sick leave exceeds 2 days.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleAskAIAboutLeave("What is the penalty or process if advance notice is not provided for leave?")}
              className="text-xs font-bold text-xperience-purple hover:underline flex items-center gap-1"
            >
              <span>Ask AI about notice exceptions & emergency policies →</span>
            </button>
          </div>
        </div>

        {/* Right: Interactive Notice Date Checker (Educational tool, NO request submission) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-xperience-purple" />
            <span>Notice Date Checker</span>
          </h2>

          <p className="text-xs text-slate-500 leading-relaxed">
            Select a prospective leave date to calculate whether it satisfies the {leaveRules.noticeDaysRequired}-day notice rule:
          </p>

          <div className="space-y-3">
            <div className="relative" ref={calendarRef}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Leave Date</label>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={`w-full bg-slate-50 border ${
                  isCalendarOpen ? 'border-xperience-purple ring-2 ring-purple-100 bg-white' : 'border-slate-200'
                } rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium flex items-center justify-between transition-all cursor-pointer shadow-xs`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Calendar className="w-4 h-4 text-xperience-purple shrink-0" />
                  <span className={targetDate ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                    {targetDate
                      ? new Date(targetDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Select target leave date...'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {targetDate && (
                    <span
                      onClick={(e) => { e.stopPropagation(); handleClearDate(); }}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
                      title="Clear date"
                    >
                      <X className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-purple-600 transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Custom Theme Calendar Popover */}
              {isCalendarOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-900/10 p-4 space-y-3 animate-fadeIn">
                  {/* Month Navigation Header */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-xperience-purple hover:bg-purple-50 transition-colors cursor-pointer"
                      title="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="text-xs font-bold text-slate-900">
                      {MONTH_NAMES[calMonth]} {calYear}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-xperience-purple hover:bg-purple-50 transition-colors cursor-pointer"
                      title="Next month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day of Week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <div key={d} className="text-[11px] font-bold text-slate-400 py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {allCalendarDays.map((item, idx) => {
                      const itemDateStr = `${item.year}-${String(item.month + 1).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
                      const isSelected = targetDate === itemDateStr;
                      const isToday = todayDateStr === itemDateStr;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            handleCalculateNotice(itemDateStr);
                            setIsCalendarOpen(false);
                          }}
                          className={`h-8 w-8 mx-auto flex items-center justify-center text-xs rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-xperience-purple text-white font-bold shadow-md shadow-purple-500/30'
                              : isToday
                                ? 'border border-xperience-purple text-xperience-purple font-bold hover:bg-purple-50'
                                : item.isCurrentMonth
                                  ? 'text-slate-700 hover:bg-purple-50 hover:text-xperience-purple font-medium'
                                  : 'text-slate-300 hover:text-slate-500'
                          }`}
                        >
                          {item.day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer actions: Clear and Today */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      type="button"
                      onClick={handleClearDate}
                      className="text-slate-500 hover:text-slate-700 font-semibold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectToday}
                      className="text-xperience-purple hover:text-xperience-darkPurple font-bold px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      Today
                    </button>
                  </div>
                </div>
              )}
            </div>

            {calculatedNotice && (
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                calculatedNotice.isCompliant
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {calculatedNotice.isCompliant ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Notice Rule Satisfied ({calculatedNotice.daysAhead} days in advance)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Notice Window Warning ({calculatedNotice.daysAhead} days in advance)</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {calculatedNotice.isCompliant
                    ? `Selecting this date provides sufficient advance notice for planned leaves under the standard policy.`
                    : `This date falls within the ${calculatedNotice.requiredDays}-day advance notice window. Please consult with your direct manager for emergency approval.`}
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Official company policy per Xperience1st Employee Handbook
            </span>
          </div>
        </div>

      </div>

      {/* Special Leaves & Labor Law Entitlements */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-xperience-purple" />
              <span>Special Leaves & Life Event Entitlements</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory and compassionate leave granted per Xperience1st Policy & Egyptian Labor Law.
            </p>
          </div>
          <button
            onClick={() => handleAskAIAboutLeave("What documentation is needed for marriage, maternity, or compassionate leave?")}
            className="text-xs font-bold text-xperience-purple hover:underline self-start sm:self-auto"
          >
            Ask AI about special leaves →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>💍 Marriage Leave</span>
              <span className="text-[10px] font-extrabold bg-purple-100 text-xperience-purple px-2 py-0.5 rounded-full">5 Paid Days</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Granted once during employment tenure. Requires at least 1 month advance notice to HR.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>🕊️ Compassionate Leave</span>
              <span className="text-[10px] font-extrabold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">1 - 3 Days</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              3 fully paid days for 1st-degree relatives (parents, spouse, children); 1 day for 2nd-degree relatives.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>👶 Maternity Leave</span>
              <span className="text-[10px] font-extrabold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">120 Paid Days</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Fully paid 120 days as per labor law, with nursing hour flexibility and legal return protections.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>🍼 Paternity Leave</span>
              <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">1 Paid Day</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              1 paid day upon child birth to support your family upon arrival.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>🕋 Hajj Pilgrimage</span>
              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">1 Full Month</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              1 month fully paid pilgrimage leave, granted once after completing 5 years of continuous service.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>🕌 Umrah Leave</span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Up to 5 Days</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Up to 5 working days deducted from annual leave with manager coordination. Beyond 5 days once every 3 years.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
