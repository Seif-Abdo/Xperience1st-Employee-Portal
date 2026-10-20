import { apiUrl } from '../api';
import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Award,
  HeartPulse,
  Laptop,
  Sparkles,
  Cake,
  PartyPopper,
  Clock,
  CheckCircle2,
  Send,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
  Flame,
  UserCheck,
  CalendarDays,
  Gift,
  HelpCircle,
  AlertCircle,
  ChevronDown,
  Check,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const SPEAK_UP_CATEGORIES = [
  'Workplace & Culture',
  'Suggestions & Ideas',
  'Ethics & Compliance',
  'Management & Leadership',
  'Facilities & Resources',
  'Wellbeing & Work-Life',
  'General Feedback'
];

// Helper to calculate days remaining until next birthday
function getBirthdayCountdown(bdayString) {
  if (!bdayString) return null;
  const parts = bdayString.split('-');
  let month, day;
  if (parts.length === 3) {
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  } else if (parts.length === 2) {
    month = parseInt(parts[0], 10) - 1;
    day = parseInt(parts[1], 10);
  } else {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let nextBday = new Date(today.getFullYear(), month, day);
  if (nextBday < today) {
    nextBday = new Date(today.getFullYear() + 1, month, day);
  }

  const diffTime = nextBday - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const formatted = nextBday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return { diffDays, formatted, nextBday };
}

export default function Dashboard({ setActivePage }) {
  const { user } = useAuth();
  const { sendMessage, setIsWidgetOpen } = useChat();
  const [quickInput, setQuickInput] = useState('');

  // Portal Content State & Loading Indicator
  const [portalContent, setPortalContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calendar filter state
  const [eventFilter, setEventFilter] = useState('all'); // 'all' | 'holiday' | 'event'

  // Speak Up form state
  const [speakUpMessage, setSpeakUpMessage] = useState('');
  const [speakUpCategory, setSpeakUpCategory] = useState('Workplace & Culture');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);
  const [speakUpStatus, setSpeakUpStatus] = useState(null); // 'submitting' | 'success' | 'error'
  const [speakUpError, setSpeakUpError] = useState('');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetch(apiUrl('/api/portal/content'))
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setPortalContent(data);
        }
      })
      .catch(err => {
        console.warn('Error fetching portal content:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const [isChartAnimated, setIsChartAnimated] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsChartAnimated(true);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const replayChartAnimation = () => {
    setIsChartAnimated(false);
    setTimeout(() => {
      setIsChartAnimated(true);
    }, 80);
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    sendMessage(quickInput);
    setQuickInput('');
    setIsWidgetOpen(true);
  };

  const triggerConfetti = (e) => {
    if (e && e.clientX && e.clientY) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      confetti({ particleCount: 50, spread: 60, origin: { x, y } });
    } else {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    }
  };

  // Speak Up Submission handler
  const handleSpeakUpSubmit = async (e) => {
    e.preventDefault();
    if (!speakUpMessage.trim()) return;

    setSpeakUpStatus('submitting');
    setSpeakUpError('');

    try {
      const res = await fetch(apiUrl('/api/speak-up'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: speakUpCategory,
          message: speakUpMessage.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSpeakUpStatus('success');
        setSpeakUpMessage('');
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
        setTimeout(() => setSpeakUpStatus(null), 5000);
      } else {
        setSpeakUpStatus('error');
        setSpeakUpError(data.error || 'Failed to submit anonymous message.');
      }
    } catch (err) {
      setSpeakUpStatus('error');
      setSpeakUpError('Connection error. Please try again.');
    }
  };

  // Resolved dynamic values (Strictly from backend content, zero mock fallbacks)
  const birthdaysList = Array.isArray(portalContent?.birthdays) ? portalContent.birthdays : [];
  const processedBirthdays = birthdaysList
    .map(b => ({
      ...b,
      countdown: getBirthdayCountdown(b.bday || b.date)
    }))
    .filter(b => b.countdown !== null)
    .sort((a, b) => a.countdown.diffDays - b.countdown.diffDays);

  const eventsList = Array.isArray(portalContent?.events) ? portalContent.events : [];
  const filteredEvents = eventsList.filter(ev => {
    if (eventFilter === 'all') return true;
    if (eventFilter === 'holiday') return ev.type?.toLowerCase().includes('holiday');
    if (eventFilter === 'event') return ev.type?.toLowerCase().includes('event');
    return true;
  });

  const employeeOfMonth = portalContent?.employeeOfTheMonth;
  const hasEmployeeOfMonth = Boolean(
    employeeOfMonth &&
    typeof employeeOfMonth === 'object' &&
    employeeOfMonth.name &&
    employeeOfMonth.name.trim()
  );

  const yearlyHeadcount = Array.isArray(portalContent?.yearlyHeadcount) ? portalContent.yearlyHeadcount : [];
  const maxCount = yearlyHeadcount.length > 0
    ? Math.max(...yearlyHeadcount.map(h => Number(h.count) || 0), 10)
    : 10;
  const latestCount = yearlyHeadcount.length > 0 ? (yearlyHeadcount[yearlyHeadcount.length - 1]?.count || 0) : 0;
  const previousCount = yearlyHeadcount.length > 1 ? (yearlyHeadcount[yearlyHeadcount.length - 2]?.count || 0) : 0;
  const growthRate = (latestCount && previousCount)
    ? Math.round(((latestCount - previousCount) / previousCount) * 100)
    : 0;

  const hasBirthdays = processedBirthdays.length > 0;
  const hasHeadcount = yearlyHeadcount.length > 0;
  const hasEvents = eventsList.length > 0;
  const hasLeftColumn = hasHeadcount || hasEvents;

  return (
    <div className="space-y-6 animate-fadeIn pb-8">

      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-r from-[#6C47C9] via-[#6A41C9] to-[#7B52DE] text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-900/15 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Hello, {user?.name ? user.name.split(' ')[0] : 'Team Member'}! 👋
          </h1>

          <p className="text-purple-100 text-xs sm:text-sm leading-relaxed opacity-95">
            Access your corporate benefits, view company policies, submit leave simulation requests, or get instant answers from our AI HR Policy Assistant.
          </p>

          {/* Quick AI Search Bar in Hero */}
          <form onSubmit={handleQuickSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Ask AI: e.g. How to request annual leave? or Salesforce voucher rules..."
                aria-label="Ask AI HR Assistant"
                className="w-full bg-white/95 text-slate-800 placeholder:text-slate-500 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-md transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-950 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask Assistant</span>
            </button>
          </form>
        </div>
      </section>

      {/* LOADING SKELETON (Prevents flashing dummy or empty cards) */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="bg-slate-100/80 border border-slate-200/60 rounded-3xl h-36" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-100/80 border border-slate-200/60 rounded-3xl h-64" />
              <div className="bg-slate-100/80 border border-slate-200/60 rounded-3xl h-72" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-100/80 border border-slate-200/60 rounded-3xl h-64" />
              <div className="bg-slate-100/80 border border-slate-200/60 rounded-3xl h-80" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 2. UPCOMING BIRTHDAYS ANNOUNCER BANNER - HIDDEN IF NO VALUES */}
          {hasBirthdays && (
            <section className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-pink-500/10 border border-purple-200/80 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden backdrop-blur-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                    <Cake className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-600 to-rose-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                        🎉 Celebrations
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">
                        Upcoming Birthdays & Anniversaries
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Join us in celebrating our teammates! Don't forget to send your warmest wishes.
                    </p>
                  </div>
                </div>

                <button
                  onClick={triggerConfetti}
                  className="inline-flex items-center gap-1.5 self-start md:self-auto text-xs font-bold text-purple-700 bg-white hover:bg-purple-50 border border-purple-200 px-3.5 py-2 rounded-xl shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <PartyPopper className="w-4 h-4 text-amber-500" />
                  <span>Send Birthday Cheers 🎊</span>
                </button>
              </div>

              {/* Birthday Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
                {processedBirthdays.slice(0, 4).map((b) => {
                  const isToday = b.countdown.diffDays === 0;
                  const isTomorrow = b.countdown.diffDays === 1;

                  return (
                    <div
                      key={b.id || b.name}
                      className={`bg-white rounded-2xl p-4 border transition-all hover:shadow-md flex items-center justify-between gap-3 ${isToday
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50 via-white to-pink-50 ring-2 ring-amber-300'
                        : 'border-slate-200/90 hover:border-purple-300'
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isToday
                          ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white animate-pulse'
                          : 'bg-purple-100 text-xperience-purple'
                          }`}>
                          {b.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {b.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate">
                            {b.email}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isToday
                          ? 'bg-rose-500 text-white shadow-xs'
                          : isTomorrow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                          }`}>
                          {isToday ? '🎂 Today!' : isTomorrow ? 'Tomorrow' : b.countdown.formatted}
                        </span>
                        {!isToday && !isTomorrow && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            In {b.countdown.diffDays}d
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 3. MAIN DASHBOARD CONTENT */}
          <section className={hasLeftColumn ? "grid grid-cols-1 lg:grid-cols-12 gap-6" : "max-w-2xl mx-auto space-y-6"}>

            {/* LEFT COLUMN: Headcount Growth Chart & Calendar Events (lg:col-span-7) */}
            {hasLeftColumn && (
              <div className="lg:col-span-7 space-y-6">

                {/* A. EMPLOYEES COUNT YEARLY PROGRESS CHART - HIDDEN IF NO VALUES */}
                {hasHeadcount && (
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-xperience-purple" />
                            <span>Employees Count Yearly Progress</span>
                          </h2>
                          <button
                            type="button"
                            onClick={replayChartAnimation}
                            title="Replay chart animation"
                            className="p-1 rounded-lg text-slate-400 hover:text-xperience-purple hover:bg-purple-50 transition-colors cursor-pointer"
                            aria-label="Replay chart animation"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 transition-transform duration-500 ${!isChartAnimated ? 'rotate-180 text-xperience-purple' : ''}`} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Xperience1st regional team growth over the years
                        </p>
                      </div>

                      <div className={`flex items-center gap-2 transition-all duration-700 ${isChartAnimated ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                        }`}>
                        {growthRate > 0 && (
                          <span className="text-xs font-black text-xperience-purple bg-purple-50 px-3 py-1 rounded-full border border-purple-100 shadow-2xs">
                            +{growthRate}% YoY Growth
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                          Total: {latestCount} Members
                        </span>
                      </div>
                    </div>

                    {/* Custom Interactive SVG/CSS Bar Chart with Staggered Entrance Animation & Gridlines */}
                    <div className="pt-4 pb-2 relative">
                      {/* Dotted horizontal guidelines */}
                      <div className="absolute inset-x-2 top-6 bottom-10 flex flex-col justify-between pointer-events-none opacity-40">
                        <div className="border-b border-dashed border-slate-200 w-full" />
                        <div className="border-b border-dashed border-slate-200 w-full" />
                        <div className="border-b border-dashed border-slate-200 w-full" />
                      </div>

                      <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 relative z-10">
                        {yearlyHeadcount.map((item, idx) => {
                          const countNum = Number(item.count) || 0;
                          const heightPercent = Math.max(Math.round((countNum / maxCount) * 100), 12);
                          const isLatest = String(item.year) === String(yearlyHeadcount[yearlyHeadcount.length - 1]?.year);
                          const staggerDelayMs = idx * 110;

                          return (
                            <div
                              key={item.year}
                              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                            >
                              {/* Tooltip on hover */}
                              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg -translate-y-1 group-hover:translate-y-0">
                                {countNum} Employees in {item.year}
                              </div>

                              {/* Bar Value above bar with staggered fade & float up */}
                              <span
                                style={{
                                  transitionDelay: isChartAnimated ? `${staggerDelayMs + 250}ms` : '0ms'
                                }}
                                className={`text-[11px] font-extrabold mb-1.5 transition-all duration-500 transform ${isChartAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                                  } ${isLatest ? 'text-xperience-purple font-black scale-105' : 'text-slate-500 group-hover:text-slate-900'
                                  }`}
                              >
                                {countNum}
                              </span>

                              {/* Milestone Cap Dot */}
                              <div
                                style={{
                                  opacity: isChartAnimated ? 1 : 0,
                                  transform: isChartAnimated ? 'scale(1)' : 'scale(0)',
                                  transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                                  transitionDelay: isChartAnimated ? `${staggerDelayMs + 200}ms` : '0ms'
                                }}
                                className={`w-2 h-2 rounded-full mb-1 transition-all ${isLatest ? 'bg-xperience-purple ring-2 ring-purple-300' : 'bg-purple-300 group-hover:bg-xperience-purple'
                                  }`}
                              />

                              {/* Bar Element with Staggered Rise on Page Load */}
                              <div
                                style={{
                                  height: isChartAnimated ? `${heightPercent}%` : '0%',
                                  transition: 'height 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms ease, box-shadow 300ms ease',
                                  transitionDelay: isChartAnimated ? `${staggerDelayMs}ms` : '0ms'
                                }}
                                className={`w-full max-w-[48px] rounded-t-xl group-hover:scale-y-[1.03] origin-bottom shadow-sm relative overflow-hidden ${isLatest
                                  ? 'bg-gradient-to-t from-[#6C47C9] via-[#7B52DE] to-[#9366EE] shadow-purple-500/25 ring-2 ring-purple-300'
                                  : 'bg-gradient-to-t from-slate-200 via-purple-100 to-purple-200/80 group-hover:from-purple-300 group-hover:to-purple-500'
                                  }`}
                              >
                                {isLatest && (
                                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 pointer-events-none" />
                                )}
                              </div>

                              {/* Year Label */}
                              <span
                                style={{
                                  transitionDelay: isChartAnimated ? `${staggerDelayMs + 100}ms` : '0ms'
                                }}
                                className={`text-xs mt-2.5 font-bold transition-all duration-500 ${isChartAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                                  } ${isLatest ? 'text-xperience-purple font-extrabold' : 'text-slate-600 group-hover:text-slate-900'
                                  }`}
                              >
                                '{String(item.year).slice(-2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Source: Official People & Operations Records</span>
                      <span className="font-semibold text-xperience-purple">Expansion across Cairo, Dubai & Regional Hubs</span>
                    </div>
                  </div>
                )}

                {/* B. CALENDAR FOR EVENTS & PUBLIC HOLIDAYS - HIDDEN IF NO VALUES */}
                {hasEvents && (
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-xperience-purple" />
                          <span>Events & Public Holidays</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Official public holidays, strategic all-hands, and team gatherings
                        </p>
                      </div>

                      {/* Filter Tabs */}
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                        <button
                          onClick={() => setEventFilter('all')}
                          className={`px-2.5 py-1 rounded-lg transition-all ${eventFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setEventFilter('holiday')}
                          className={`px-2.5 py-1 rounded-lg transition-all ${eventFilter === 'holiday' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          Holidays
                        </button>
                        <button
                          onClick={() => setEventFilter('event')}
                          className={`px-2.5 py-1 rounded-lg transition-all ${eventFilter === 'event' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          Company Events
                        </button>
                      </div>
                    </div>

                    {/* Events List */}
                    <div className="space-y-3">
                      {filteredEvents.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400">
                          No events found in this category.
                        </div>
                      ) : (
                        filteredEvents.map((evt) => {
                          const isHoliday = evt.type?.toLowerCase().includes('holiday');
                          const dateObj = new Date(evt.date);
                          const validDate = !isNaN(dateObj);
                          const dayNum = validDate ? dateObj.getDate() : '--';
                          const monthStr = validDate ? dateObj.toLocaleDateString('en-US', { month: 'short' }) : 'Date';
                          const weekday = validDate ? dateObj.toLocaleDateString('en-US', { weekday: 'short' }) : '';

                          return (
                            <div
                              key={evt.id || evt.title}
                              className="flex items-start gap-4 p-3.5 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all"
                            >
                              {/* Date Badge Chip */}
                              <div className={`w-14 rounded-2xl p-2 text-center shrink-0 border ${isHoliday
                                ? 'bg-rose-50 border-rose-200 text-rose-700'
                                : 'bg-purple-50 border-purple-200 text-xperience-purple'
                                }`}>
                                <div className="text-[10px] font-black uppercase tracking-wider">{monthStr}</div>
                                <div className="text-lg font-black leading-tight">{dayNum}</div>
                                <div className="text-[9px] font-semibold opacity-75">{weekday}</div>
                              </div>

                              {/* Event Details */}
                              <div className="flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                                    {evt.title}
                                  </h3>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isHoliday
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-indigo-100 text-indigo-700'
                                    }`}>
                                    {evt.type || 'Event'}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {evt.description}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* RIGHT COLUMN: Employee of the Month & Speak Up Box */}
            <div className={hasLeftColumn ? "lg:col-span-5 space-y-6" : "w-full space-y-6"}>

              {/* C. EMPLOYEE OF THE MONTH SPOTLIGHT - HIDDEN IF NO VALUES */}
              {hasEmployeeOfMonth && (
                <div className="bg-gradient-to-br from-[#6C47C9] via-[#6A41C9] to-[#7B52DE] text-white rounded-3xl p-6 shadow-xl shadow-purple-900/15 relative overflow-hidden space-y-5">
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/15 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black tracking-wide border border-white/25 text-amber-200">
                      <Flame className="w-3.5 h-3.5 text-amber-300" />
                      <span>Employee of the Month</span>
                    </span>
                    <span className="text-xs font-bold text-purple-200">
                      {employeeOfMonth.month || 'Current Month'}
                    </span>
                  </div>

                  {/* Profile Spotlight Details */}
                  <div className="relative z-10 flex items-center gap-4 pt-1">
                    <div className="relative shrink-0">
                      {employeeOfMonth.image ? (
                        <img
                          src={employeeOfMonth.image}
                          alt={employeeOfMonth.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-300/40 shadow-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md ring-4 ring-amber-300/40 flex items-center justify-center text-xl font-black">
                          {employeeOfMonth.name?.charAt(0) || 'E'}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 p-1 rounded-lg shadow-sm">
                        <Award className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-black text-white tracking-tight truncate">
                        {employeeOfMonth.name}
                      </h3>
                      <div className="text-xs text-purple-200 font-medium">
                        {employeeOfMonth.role}
                      </div>
                      <div className="text-[11px] text-purple-300 truncate">
                        {employeeOfMonth.department}
                      </div>
                    </div>
                  </div>

                  {/* Achievement Quote / Rationale */}
                  {employeeOfMonth.achievement && (
                    <div className="relative z-10 bg-slate-950/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-xs text-purple-100 leading-relaxed italic">
                      "{employeeOfMonth.achievement}"
                    </div>
                  )}

                  {/* Congratulate Button with Confetti */}
                  <div className="relative z-10 pt-1">
                    <button
                      onClick={triggerConfetti}
                      className="w-full bg-white hover:bg-purple-50 text-slate-900 font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                    >
                      <PartyPopper className="w-4 h-4 text-amber-500" />
                      <span>Congratulate & Celebrate 🎉</span>
                    </button>
                  </div>
                </div>
              )}

              {/* D. SPEAK UP BOX (100% Anonymous Feedback Submission) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-xperience-purple" />
                      <span>Speak Up — 100% Anonymous</span>
                    </h2>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Zero Tracking 🔒
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Have a concern, suggestion, or feedback? Share it directly with leadership completely anonymously. No user token or personal data is collected.
                  </p>
                </div>

                {/* Submission Status Alerts */}
                {speakUpStatus === 'success' && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Thank you! Your feedback has been anonymously submitted to leadership.</span>
                  </div>
                )}

                {speakUpStatus === 'error' && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{speakUpError}</span>
                  </div>
                )}

                {/* Speak Up Form */}
                <form onSubmit={handleSpeakUpSubmit} className="space-y-3.5">
                  <div className="relative" ref={categoryRef}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className={`w-full bg-slate-50 border ${isCategoryOpen ? 'border-xperience-purple ring-2 ring-purple-100 bg-white' : 'border-slate-200'
                        } rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium flex items-center justify-between transition-all cursor-pointer shadow-xs`}
                    >
                      <span className="truncate">{speakUpCategory}</span>
                      <ChevronDown className={`w-4 h-4 text-purple-600 transition-transform duration-200 shrink-0 ${isCategoryOpen ? 'rotate-180' : ''
                        }`} />
                    </button>

                    {isCategoryOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-purple-100/90 rounded-2xl shadow-xl shadow-purple-900/10 py-1.5 max-h-60 overflow-y-auto animate-fadeIn divide-y divide-slate-50">
                        {SPEAK_UP_CATEGORIES.map((cat) => {
                          const isSelected = speakUpCategory === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setSpeakUpCategory(cat);
                                setIsCategoryOpen(false);
                              }}
                              className={`w-full px-3.5 py-2.5 text-xs text-left transition-colors flex items-center justify-between cursor-pointer ${isSelected
                                ? 'bg-purple-50/80 text-xperience-purple font-bold'
                                : 'text-slate-700 hover:bg-purple-50/50 hover:text-xperience-purple font-medium'
                                }`}
                            >
                              <span>{cat}</span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-xperience-purple shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confidential Message
                    </label>
                    <textarea
                      rows={4}
                      value={speakUpMessage}
                      onChange={(e) => setSpeakUpMessage(e.target.value)}
                      placeholder="Describe your suggestion, concern, or feedback in detail. Be as open as you like..."
                      aria-label="Anonymous Speak Up Message"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-xperience-purple focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                      required
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>Never mentions your name or email</span>
                      <span>{speakUpMessage.length} chars</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={speakUpStatus === 'submitting' || !speakUpMessage.trim()}
                    className="w-full bg-slate-900 hover:bg-slate-950 disabled:bg-slate-300 text-white font-bold py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:cursor-not-allowed active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{speakUpStatus === 'submitting' ? 'Submitting Anonymously...' : 'Submit Anonymous Feedback'}</span>
                  </button>
                </form>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <span className="text-[11px] text-slate-400">
                    Routed to People & Operations and Executive Review
                  </span>
                </div>
              </div>

            </div>

          </section>
        </>
      )}

    </div>
  );
}
