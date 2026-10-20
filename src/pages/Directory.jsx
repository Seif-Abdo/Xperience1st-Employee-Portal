import { apiUrl } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Laptop, 
  Copy, 
  Check, 
  Sparkles,
  MapPin,
  Clock,
  Network
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

const DEFAULT_CONTACTS = {
  hrEmail: 'hr@xperience1st.com',
  emergencyPhone: '+20 (2) 2790-1122',
  itEmail: 'support@xperience1st.com',
  itSlack: '#it-helpdesk',
  healthEmail: 'health@xperience1st.com',
  healthPhone: '+20 (2) 2790-1123',
  ethicsEmail: 'ethics@xperience1st.com',
  workingHours: 'Sunday to Thursday, 9:00 AM - 5:00 PM (Cairo Time)',
  headquarters: 'Xperience1st HQ, Cairo, Egypt'
};

export default function Directory({ setActivePage }) {
  const { sendMessage, setIsWidgetOpen } = useChat();
  const [copiedKey, setCopiedKey] = useState(null);
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);

  useEffect(() => {
    fetch(apiUrl('/api/portal/content'))
      .then(res => res.json())
      .then(data => {
        if (data && data.contacts) {
          setContacts(prev => ({ ...prev, ...data.contacts }));
        }
      })
      .catch(err => {
        console.warn('Using default contacts:', err);
      });
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const contactList = [
    {
      id: 'hr_ops',
      title: 'HR Operations & General Inquiries',
      dept: 'People & Operations',
      email: contacts.hrEmail,
      phone: contacts.emergencyPhone,
      hours: contacts.workingHours,
      description: 'Annual leave questions, salary certificates, official employment letters, and general HR queries.',
      icon: Building2
    }
  ];

  const handleAskAIAboutContact = () => {
    sendMessage("Who should I contact in HR Operations for inquiries or official employment letters?");
    setIsWidgetOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-xperience-purple" />
            <span>Company & HR Contacts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct communication channels for People Operations and General HR Inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {setActivePage && (
            <button
              onClick={() => setActivePage('hierarchy')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Network className="w-3.5 h-3.5 text-xperience-purple" />
              <span>Org Chart & Hierarchy Tree</span>
            </button>
          )}
          <button
            onClick={handleAskAIAboutContact}
            className="inline-flex items-center gap-2 text-xs font-bold text-xperience-purple bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Contact Matrix</span>
          </button>
        </div>
      </div>

      {/* Corporate Overview Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Official Office Working Schedule</div>
            <div className="text-[11px] text-slate-400">{contacts.workingHours}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
          <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{contacts.headquarters}</span>
        </div>
      </div>

      {/* Contacts Card */}
      <div className="max-w-3xl">
        {contactList.map((c) => {
          const Icon = c.icon;
          return (
            <div 
              key={c.id} 
              className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-4 transition-all hover:border-slate-300 ${
                c.confidential ? 'border-purple-200 bg-purple-50/20' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-xperience-purple flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{c.title}</h2>
                    <span className="text-[11px] text-slate-500">{c.dept}</span>
                  </div>
                </div>

                {c.confidential && (
                  <span className="text-[10px] font-bold bg-purple-100 text-xperience-purple px-2 py-0.5 rounded-full shrink-0">
                    Confidential
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {c.description}
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                {c.email && (
                  <div className="flex flex-wrap items-center justify-between gap-1 group">
                    <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email:</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`mailto:${c.email}`} 
                        className="font-mono font-medium text-slate-800 hover:text-xperience-purple underline-offset-2 hover:underline break-all"
                        aria-label={`Send email to ${c.email}`}
                      >
                        {c.email}
                      </a>
                      <button 
                        onClick={() => handleCopy(c.email, `${c.id}_email`)}
                        className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition-all"
                        title="Copy Email"
                        aria-label={`Copy email address ${c.email}`}
                      >
                        {copiedKey === `${c.id}_email` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {c.phone && (
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone:</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`tel:${c.phone.replace(/[^+\d]/g, '')}`} 
                        className="font-mono font-medium text-slate-800 hover:text-xperience-purple underline-offset-2 hover:underline"
                        aria-label={`Call ${c.phone}`}
                      >
                        {c.phone}
                      </a>
                      <button 
                        onClick={() => handleCopy(c.phone, `${c.id}_phone`)}
                        className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition-all"
                        title="Copy Phone"
                        aria-label={`Copy phone number ${c.phone}`}
                      >
                        {copiedKey === `${c.id}_phone` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {c.slack && (
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                      <Laptop className="w-3.5 h-3.5" />
                      <span>Slack:</span>
                    </span>
                    <span className="font-mono font-bold text-xperience-purple">{c.slack}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
