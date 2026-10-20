import { apiUrl } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  MessageSquare, 
  Clock, 
  Trash2, 
  ArrowLeft, 
  ExternalLink,
  Bot,
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import FormattedMessage from '../components/FormattedMessage';

export default function HistoryPage({ setActivePage }) {
  const { user, token } = useAuth();
  const { sessions, deleteChatSession, selectSession, setIsWidgetOpen } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionData, setSelectedSessionData] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showMobileTranscript, setShowMobileTranscript] = useState(false);

  const filteredSessions = sessions.filter(s =>
    (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.preview || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewSession = async (sessionId) => {
    setIsLoadingDetails(true);
    setShowMobileTranscript(true);
    try {
      const res = await fetch(apiUrl(`/api/user/chats/${sessionId}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedSessionData(data);
      }
    } catch (e) {
      console.error('Failed to load session details:', e);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-xperience-purple" />
            <span>My Policy Query History</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your past questions and answers regarding company policies, leave notice rules, and medical benefits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsWidgetOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#6C47C9] to-[#7B52DE] hover:opacity-95 px-3.5 py-2 rounded-xl shadow-md shadow-xperience-purple/20 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Resume in AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sessions List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        
        {/* Sessions List (Responsive: hide on mobile when transcript is open) */}
        <div className={`
          lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex-col
          ${showMobileTranscript ? 'hidden lg:flex' : 'flex'}
        `}>
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous queries..."
              aria-label="Search previous chat queries"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-[16px] sm:text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-xperience-purple"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[550px]">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No past chat sessions found.
              </div>
            ) : (
              filteredSessions.map((s) => (
                <div
                  key={s.sessionId}
                  onClick={() => handleViewSession(s.sessionId)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedSessionData?.sessionId === s.sessionId
                      ? 'bg-purple-50/70 border-xperience-purple shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-slate-900 truncate max-w-[180px]">
                        {s.title || 'Policy Inquiry'}
                      </span>
                      {(s.isSpeakUp || s.title?.includes('Speak Up')) && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-md font-bold shrink-0">
                          🛡️ Speak Up
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {new Date(s.lastUpdated || s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {s.preview || 'No messages'}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <span className="font-mono">{s.sessionId}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatSession(s.sessionId);
                        if (selectedSessionData?.sessionId === s.sessionId) {
                          setSelectedSessionData(null);
                        }
                      }}
                      className="p-1 hover:text-rose-600 transition-colors"
                      title="Delete Session"
                      aria-label="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detailed Transcript Inspector */}
        <div className={`
          lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex-col
          ${!showMobileTranscript ? 'hidden lg:flex' : 'flex'}
        `}>
          
          {/* Mobile Back Button */}
          <div className="lg:hidden pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setShowMobileTranscript(false)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-xperience-purple hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sessions List</span>
            </button>
          </div>

          {selectedSessionData ? (
            <div className="flex-1 flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedSessionData.title || 'Conversation Transcript'}
                    </h3>
                    {(selectedSessionData.isSpeakUp || selectedSessionData.title?.includes('Speak Up')) && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                        🛡️ Speak Up (Anonymous)
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Session: {selectedSessionData.sessionId} • {(selectedSessionData.messages?.length) || 0} messages
                  </div>
                </div>

                <button
                  onClick={() => {
                    selectSession(selectedSessionData.sessionId);
                    setIsWidgetOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-xperience-purple hover:underline cursor-pointer"
                >
                  <span>Open in Assistant →</span>
                </button>
              </div>

              {/* Message Bubbles */}
              <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px] p-1 sm:p-2">
                {(selectedSessionData.messages || []).map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                      {m.role === 'user' ? (user?.name || 'You') : 'Xperience1st HR Assistant'}
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-xs max-w-[90%] sm:max-w-[85%] leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-gradient-to-r from-[#6C47C9] to-[#7B52DE] text-white rounded-tr-none shadow-xs'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                      }`}
                    >
                      <FormattedMessage content={m.content} isUser={m.role === 'user'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300" />
              <div className="text-sm font-bold text-slate-600">Select a Conversation</div>
              <p className="text-xs max-w-sm">
                Tap on any session from the list to review the full question and answer transcript.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
