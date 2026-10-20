import { apiUrl } from '../api';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Network, 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Linkedin, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight, 
  ChevronUp, 
  Copy, 
  Check, 
  Sparkles, 
  Building, 
  Briefcase, 
  ShieldCheck, 
  Layers, 
  LayoutGrid,
  GitBranch,
  X,
  UserCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  FolderTree,
  CornerDownRight,
  Eye,
  Move
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const ORG_MEMBERS = [
  {
    id: 'waleed_sharawy',
    name: 'Waleed Sharawy',
    title: 'CEO & Finance',
    department: 'Executive & Finance',
    level: 'Executive',
    phone: '01110126696',
    email: 'waleed@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/waleed-shaarawy/',
    image: 'https://i.ibb.co/60S1MC3p/image.jpg',
    reportsTo: null,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    summary: 'Executive leadership, strategic direction, and corporate finance across regional operations.'
  },
  {
    id: 'fatma_tarek',
    name: 'Fatma Tarek',
    title: 'General Accountant',
    department: 'Executive & Finance',
    level: 'Finance',
    phone: '01069581898',
    email: 'fatma@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/fatma-tarek-ll-cma-in-progress-8587171b4/',
    image: 'https://i.ibb.co/LXP5qvN3/image.jpg',
    reportsTo: 'waleed_sharawy',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    summary: 'Financial accounting, corporate budgeting, vendor disbursements, and financial statement reporting.'
  },
  {
    id: 'hend_adel',
    name: 'Hend Adel',
    title: 'People & Operations Manager',
    department: 'People & Operations',
    level: 'Management',
    phone: '01080016922',
    email: 'hend.adel@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/hend-adel-/',
    image: 'https://i.ibb.co/ZRLV8K8c/image.jpg',
    reportsTo: 'waleed_sharawy',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    summary: 'Leads People & Operations, company policy administration, talent strategy, and workplace culture.'
  },
  {
    id: 'jumana',
    name: 'Jumana',
    title: 'Operation & Talent Management',
    department: 'People & Operations',
    level: 'Specialist',
    phone: '01150919997',
    email: 'jumana@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/jumana-alaraby-bb4aa324b/',
    image: 'https://i.ibb.co/HD6mkkWL/image.jpg',
    reportsTo: 'hend_adel',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    summary: 'Operations execution, talent onboarding, employee engagement, and performance enablement.'
  },
  {
    id: 'maysan_seif',
    name: 'Maysan Seif',
    title: 'HR Supervisor',
    department: 'People & Operations',
    level: 'Supervisor',
    phone: '+20 10 30343484',
    email: 'maysan.saif@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/maysan-hanafy-saif-714bba137/',
    image: 'https://i.ibb.co/BDNvkPq/image.jpg',
    reportsTo: 'hend_adel',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    summary: 'HR daily supervision, employee attendance, insurance documentation, and leaves coordination.'
  },
  {
    id: 'hassan_ahmed',
    name: 'Hassan Ahmed',
    title: 'Director of Solutions and Delivery',
    department: 'Solutions & Delivery',
    level: 'Director',
    phone: '01005156124',
    email: 'hahmed@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/hassan-ahmed-87011465/',
    image: 'https://i.ibb.co/1tWvbQf1/image.jpg',
    reportsTo: 'waleed_sharawy',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    summary: 'Directs multi-cloud enterprise solution architecture, project governance, and client delivery success.'
  },
  {
    id: 'mohammed_adel',
    name: 'Mohammed Adel',
    title: 'Head of Salesforce',
    department: 'Salesforce Practice',
    level: 'Practice Lead',
    phone: '+353 87 406 1456',
    email: 'madel@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/madeljammaleldin/',
    image: 'https://i.ibb.co/cXgTK3cJ/image.jpg',
    reportsTo: 'hassan_ahmed',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    summary: 'Head of Salesforce consulting practice, technical certifications, and enterprise architecture.'
  },
  {
    id: 'mohamed_galal',
    name: 'Mohamed Galal',
    title: 'Salesforce Team Leader',
    department: 'Salesforce Practice',
    level: 'Team Lead',
    phone: '011217170026',
    email: 'mohamed.galal@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/mohamed-mahmoud-galal-562146125/',
    image: 'https://i.ibb.co/0pZgQdYp/image.jpg',
    reportsTo: 'mohammed_adel',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    summary: 'Leads Salesforce implementation teams, custom Apex/LWC delivery, and sprint milestones.'
  },
  {
    id: 'mahmoud_hamdy',
    name: 'Mahmoud Hamdy',
    title: 'Genesys Team Leader',
    department: 'Genesys Practice',
    level: 'Team Lead',
    phone: 'N/A',
    email: 'mahmoud.hamdy@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/mahmoud-hamdy-b58843251/',
    image: 'https://i.ibb.co/m5hnhG2J/image.jpg',
    reportsTo: 'hassan_ahmed',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
    summary: 'Leads Genesys Cloud CX contact center integrations, IVR workflows, and workforce engagement.'
  },
  {
    id: 'ragab_monier',
    name: 'Ragab Monier',
    title: 'Salesforce Commercial',
    department: 'Commercial & Growth',
    level: 'Commercial',
    phone: '01100780727',
    email: 'rmunir@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/ragabmounir/',
    image: 'https://i.ibb.co/xKTNPXPX/image.jpg',
    reportsTo: 'waleed_sharawy',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    summary: 'Commercial accounts, Salesforce enterprise client partnerships, and deal progression.'
  },
  {
    id: 'ahmed_raafat',
    name: 'Ahmed Raafat',
    title: 'Genesys Commercial',
    department: 'Commercial & Growth',
    level: 'Commercial',
    phone: '+971 50 963 1007',
    email: 'raafat@xperiencelst.com',
    linkedin: 'https://www.linkedin.com/in/araafatcx/',
    image: 'https://i.ibb.co/1twZWc5Z/image.jpg',
    reportsTo: 'waleed_sharawy',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    summary: 'Regional commercial growth for Genesys Cloud CX contact center solutions across EMEA.'
  }
];

export default function HierarchyPage() {
  const { sendMessage, setIsWidgetOpen } = useChat();

  const [members, setMembers] = useState(ORG_MEMBERS);

  useEffect(() => {
    fetch(apiUrl('/api/portal/content'))
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.hierarchy) && data.hierarchy.length > 0) {
          setMembers(data.hierarchy);
        }
      })
      .catch(err => {
        console.warn('Using default hierarchy:', err);
      });
  }, []);

  const [viewMode, setViewMode] = useState('tree'); // 'tree' | 'explorer' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [focusRootId, setFocusRootId] = useState('waleed_sharawy');
  const [collapsedNodes, setCollapsedNodes] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [zoom, setZoom] = useState(0.85);

  const treeContainerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const departments = useMemo(() => {
    const list = Array.from(new Set(members.map(m => m.department)));
    return ['all', ...list];
  }, [members]);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return members.filter(m => {
      const matchDept = selectedDept === 'all' || m.department === selectedDept;
      const matchQuery = !q || 
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        m.department.toLowerCase().includes(q);
      return matchDept && matchQuery;
    });
  }, [searchQuery, selectedDept, members]);

  // Center tree on container mount or when root changes
  const centerTree = () => {
    if (treeContainerRef.current) {
      const container = treeContainerRef.current;
      const scrollTarget = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTo({ left: Math.max(0, scrollTarget), top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (viewMode === 'tree') {
      const timer = setTimeout(centerTree, 150);
      return () => clearTimeout(timer);
    }
  }, [viewMode, focusRootId, zoom]);

  // Handle Drag-to-Pan on Canvas
  const handleMouseDown = (e) => {
    // Only pan if clicking on background canvas, not on cards or buttons
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.member-card')) {
      return;
    }
    setIsPanning(true);
    setPanStart({
      x: e.clientX,
      y: e.clientY,
      scrollLeft: treeContainerRef.current ? treeContainerRef.current.scrollLeft : 0,
      scrollTop: treeContainerRef.current ? treeContainerRef.current.scrollTop : 0
    });
  };

  const handleMouseMove = (e) => {
    if (!isPanning || !treeContainerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    treeContainerRef.current.scrollLeft = panStart.scrollLeft - dx;
    treeContainerRef.current.scrollTop = panStart.scrollTop - dy;
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const toggleCollapse = (nodeId) => {
    setCollapsedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const expandAll = () => setCollapsedNodes({});
  const collapseAll = () => {
    const collapsed = {};
    members.forEach(m => {
      const hasChildren = members.some(c => c.reportsTo === m.id);
      if (hasChildren) collapsed[m.id] = true;
    });
    setCollapsedNodes(collapsed);
  };

  const handleCopyContact = (member) => {
    const text = `${member.name} - ${member.title}\nEmail: ${member.email}\nPhone: ${member.phone}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAskAboutMember = (member) => {
    sendMessage(`Who is ${member.name} and what are their responsibilities at Xperience1st as ${member.title}?`);
    setIsWidgetOpen(true);
  };

  // Helper hierarchy functions
  const getMemberById = (id) => members.find(m => m.id === id);

  const getChildren = (parentId) => {
    return members.filter(m => m.reportsTo === parentId);
  };

  const getAncestors = (memberId) => {
    const chain = [];
    let curr = getMemberById(memberId);
    while (curr && curr.reportsTo) {
      const parent = getMemberById(curr.reportsTo);
      if (parent) {
        chain.unshift(parent);
        curr = parent;
      } else {
        break;
      }
    }
    return chain;
  };

  const getPeers = (member) => {
    if (!member.reportsTo) return [];
    return members.filter(m => m.reportsTo === member.reportsTo && m.id !== member.id);
  };

  const activeRootMember = getMemberById(focusRootId) || members.find(m => !m.reportsTo);

  // Department quick filter in tree view
  const handleDepartmentFilter = (dept) => {
    setSelectedDept(dept);
    if (dept === 'all') {
      const ceoNode = members.find(m => !m.reportsTo);
      setFocusRootId(ceoNode ? ceoNode.id : 'waleed_sharawy');
    } else {
      // Find the highest ranking leader in that department
      const deptMembers = members.filter(m => m.department === dept);
      if (deptMembers.length > 0) {
        // Find member with fewest ancestors (highest in hierarchy)
        let top = deptMembers[0];
        let minDepth = getAncestors(top.id).length;
        deptMembers.forEach(m => {
          const depth = getAncestors(m.id).length;
          if (depth < minDepth) {
            top = m;
            minDepth = depth;
          }
        });
        setFocusRootId(top.id);
      }
    }
  };

  // Render a Single Tree Node in Visual Canvas View
  const renderTreeNode = (member, depth = 0) => {
    const children = getChildren(member.id);
    const hasChildren = children.length > 0;
    const isCollapsed = !!collapsedNodes[member.id];
    const isMatchesSearch = searchQuery && filteredMembers.some(m => m.id === member.id);
    const isCurrentFocusRoot = focusRootId === member.id;

    return (
      <div key={member.id} className="flex flex-col items-center">
        {/* Node Card */}
        <div 
          onClick={() => setSelectedMember(member)}
          className={`
            member-card relative group cursor-pointer transition-all duration-300
            w-64 sm:w-72 bg-white rounded-2xl p-4 border text-left
            shadow-xs hover:shadow-xl hover:-translate-y-1 select-text
            ${isMatchesSearch ? 'ring-3 ring-purple-500 border-purple-400 shadow-md' : 'border-slate-200/90 hover:border-purple-300'}
            ${isCurrentFocusRoot ? 'bg-gradient-to-b from-purple-50 via-white to-white ring-2 ring-purple-400' : ''}
          `}
        >
          {/* Top Row: Avatar & Level Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="relative">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-100 shadow-xs"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white"></span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${member.badgeColor}`}>
                {member.level}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                L{depth + 1}
              </span>
            </div>
          </div>

          {/* Name & Title */}
          <div className="mt-2.5">
            <div className="text-sm font-bold text-slate-900 group-hover:text-xperience-purple transition-colors truncate">
              {member.name}
            </div>
            <div className="text-xs text-slate-600 font-medium leading-snug line-clamp-1 mt-0.5">
              {member.title}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1 truncate">
              {member.department}
            </div>
          </div>

          {/* Direct reports summary pill */}
          {hasChildren && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-purple-700 font-bold bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Users className="w-2.5 h-2.5" />
                <span>{children.length} Direct Reports</span>
              </span>

              {focusRootId !== member.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusRootId(member.id);
                  }}
                  title="Focus on this team branch"
                  className="text-[10px] font-bold text-xperience-purple hover:underline flex items-center gap-0.5"
                >
                  <Eye className="w-2.5 h-2.5" />
                  <span>Focus</span>
                </button>
              )}
            </div>
          )}

          {/* Quick Action Footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              {member.phone && member.phone !== 'N/A' && (
                <a 
                  href={`tel:${member.phone.replace(/\s+/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  title="Call Phone"
                  className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
              <a 
                href={`mailto:${member.email}`}
                onClick={(e) => e.stopPropagation()}
                title="Send Email"
                className="p-1 hover:text-xperience-purple hover:bg-purple-50 rounded-md transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
              {member.linkedin && (
                <a 
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="LinkedIn Profile"
                  className="p-1 hover:text-[#0A66C2] hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyContact(member);
                }}
                title="Copy Contact Information"
                className="text-[11px] text-slate-400 hover:text-slate-800 flex items-center gap-1 p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                {copiedId === member.id ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Toggle Expand/Collapse Button for Branches */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(member.id);
              }}
              className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border border-slate-300 hover:border-xperience-purple shadow-xs flex items-center justify-center text-slate-600 hover:text-xperience-purple transition-all z-10 cursor-pointer"
              title={isCollapsed ? `Expand ${children.length} direct reports` : 'Collapse branch'}
            >
              {isCollapsed ? (
                <span className="text-[11px] font-bold text-xperience-purple">+{children.length}</span>
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Tree Branch Connections & Child Nodes */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col items-center mt-3">
            {/* Vertical connector from parent to branch bar */}
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Horizontal Branch Bar */}
            <div className="flex items-start justify-center gap-6 sm:gap-8 pt-3 relative">
              {children.length > 1 && (
                <div 
                  className="absolute top-0 h-0.5 bg-slate-300"
                  style={{
                    left: `calc(100% / ${children.length * 2})`,
                    right: `calc(100% / ${children.length * 2})`
                  }}
                />
              )}

              {children.map(child => (
                <div key={child.id} className="flex flex-col items-center relative">
                  {/* Vertical line dropping to child */}
                  <div className="w-0.5 h-3 bg-slate-300 -mt-3 mb-0"></div>
                  {renderTreeNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Org Explorer (Nested Tree List View)
  const renderExplorerNode = (member, depth = 0) => {
    const children = getChildren(member.id);
    const hasChildren = children.length > 0;
    const isCollapsed = !!collapsedNodes[member.id];
    const isMatchesSearch = searchQuery && filteredMembers.some(m => m.id === member.id);

    return (
      <div key={member.id} className="space-y-1">
        <div 
          onClick={() => setSelectedMember(member)}
          style={{ paddingLeft: `${depth * 28 + 12}px` }}
          className={`
            flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group
            ${isMatchesSearch ? 'bg-purple-50/80 border-purple-300 shadow-2xs' : 'bg-white border-slate-200/80 hover:border-purple-200 hover:bg-slate-50'}
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Expand / Collapse toggle or indent dot */}
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollapse(member.id);
                }}
                className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center text-slate-600 group-hover:text-xperience-purple transition-colors cursor-pointer shrink-0"
              >
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
            )}

            <div className="relative shrink-0">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white"></span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 group-hover:text-xperience-purple transition-colors truncate">
                  {member.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${member.badgeColor}`}>
                  {member.level}
                </span>
              </div>
              <div className="text-xs text-slate-600 truncate">
                {member.title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-2">
            <span className="hidden md:inline-block text-[11px] text-slate-400 uppercase tracking-wider">
              {member.department}
            </span>

            {hasChildren && (
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60 hidden sm:inline-block">
                {children.length} reports
              </span>
            )}

            {/* Quick Contacts */}
            <div className="flex items-center gap-1">
              {member.phone && member.phone !== 'N/A' && (
                <a
                  href={`tel:${member.phone.replace(/\s+/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={`mailto:${member.email}`}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-slate-400 hover:text-xperience-purple hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-slate-400 hover:text-[#0A66C2] hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                </a>
              )}
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-xperience-purple group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Children Rows */}
        {hasChildren && !isCollapsed && (
          <div className="space-y-1 relative">
            {children.map(child => renderExplorerNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const fullCeo = members.find(m => !m.reportsTo);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-xperience-purple px-2 py-0.5 rounded-md">
              Organizational Chart
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              {members.length} Key Leaders & Specialists
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-1">
            <Network className="w-6 h-6 text-xperience-purple" />
            <span>Company Hierarchy & Leadership Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive organizational structure, executive reporting chains, practice leads, and direct points of contact.
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {viewMode === 'tree' && (
            <div className="flex items-center gap-1.5 mr-2">
              <button
                onClick={expandAll}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Collapse
              </button>
            </div>
          )}

          {/* Toggle Tree vs Explorer vs Grid View */}
          <div className="inline-flex bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('tree')}
              title="Interactive Visual Org Tree"
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'tree' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-xperience-purple" />
              <span>Org Tree</span>
            </button>
            <button
              onClick={() => setViewMode('explorer')}
              title="Collapsible Nested Directory List"
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'explorer' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 text-xperience-purple" />
              <span>Org Explorer</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Directory Cards Grid"
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-xperience-purple" />
              <span>Cards Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, practice, or contact..."
              aria-label="Search organizational directory"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 sm:py-3 text-[16px] sm:text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-xperience-purple focus:ring-2 focus:ring-purple-100 shadow-2xs transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => handleDepartmentFilter(dept)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer
                ${selectedDept === dept
                  ? 'bg-gradient-to-r from-[#6C47C9] to-[#7B52DE] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50/50'
                }
              `}
            >
              {dept === 'all' ? 'All Departments' : dept}
              {dept === 'all' ? ` (${members.length})` : ` (${members.filter(m => m.department === dept).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Content: Interactive Org Tree OR Org Explorer OR Directory Grid */}
      {viewMode === 'tree' ? (
        <div className="space-y-3">
          {/* Tree Navigation Toolbar & Branch Breadcrumb */}
          <div className="bg-white border border-slate-200/90 rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Active Tree View:</span>
              {focusRootId === 'waleed_sharawy' ? (
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-xperience-purple" />
                  <span>Full Company Tree (Root: {activeRootMember?.name})</span>
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xperience-purple flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{activeRootMember?.name}'s Team Branch</span>
                  </span>
                  <button
                    onClick={() => setFocusRootId('waleed_sharawy')}
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    Reset to Full Tree
                  </button>
                </div>
              )}
            </div>

            {/* Canvas Zoom & Center Controls */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <span className="text-[10px] text-slate-400 font-mono mr-1 flex items-center gap-1">
                <Move className="w-3 h-3 text-slate-400" />
                <span className="hidden md:inline">Click & drag to pan</span>
              </span>

              <button
                onClick={() => setZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2)))}
                title="Zoom Out"
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              
              <span className="text-[11px] font-mono font-bold text-slate-600 w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={() => setZoom(z => Math.min(1.3, +(z + 0.15).toFixed(2)))}
                title="Zoom In"
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => { setZoom(0.85); centerTree(); }}
                title="Reset Zoom & Center Tree"
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ml-1"
              >
                Center
              </button>
            </div>
          </div>

          {/* Interactive Tree Canvas with Drag-to-Pan */}
          <div 
            ref={treeContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`
              relative overflow-auto min-h-[620px] max-h-[750px] 
              bg-slate-100/70 border border-slate-200/90 rounded-3xl p-6 sm:p-12
              ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}
              select-none shadow-inner
            `}
          >
            <div 
              style={{ 
                transform: `scale(${zoom})`, 
                transformOrigin: 'top center',
                transition: isPanning ? 'none' : 'transform 0.2s ease-out'
              }}
              className="w-max min-w-full flex justify-center py-4"
            >
              {activeRootMember ? renderTreeNode(activeRootMember) : null}
            </div>
          </div>
        </div>
      ) : viewMode === 'explorer' ? (
        /* Org Explorer: Nested Directory List */
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-xperience-purple" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Organizational Hierarchy Tree
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Click any leader to inspect profile or expand their team
            </div>
          </div>

          <div className="space-y-1.5">
            {fullCeo ? renderExplorerNode(fullCeo) : null}
          </div>
        </div>
      ) : (
        /* Cards Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMembers.map((member) => {
            const reports = getChildren(member.id);
            const manager = member.reportsTo ? getMemberById(member.reportsTo) : null;

            return (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="relative">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-100 shadow-xs group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white"></span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${member.badgeColor}`}>
                      {member.level}
                    </span>
                  </div>

                  <div className="font-bold text-base text-slate-900 group-hover:text-xperience-purple transition-colors truncate">
                    {member.name}
                  </div>
                  <div className="text-xs text-slate-600 font-medium leading-snug line-clamp-1 mt-0.5">
                    {member.title}
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1 truncate">
                    {member.department}
                  </div>

                  {/* Manager and Direct reports indicators */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                    {manager && (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium truncate max-w-full">
                        Reports to: {manager.name}
                      </span>
                    )}
                    {reports.length > 0 && (
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-bold">
                        Manages {reports.length}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                    {member.summary}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {member.phone && member.phone !== 'N/A' && (
                      <a 
                        href={`tel:${member.phone.replace(/\s+/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        title="Call"
                        className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                    <a 
                      href={`mailto:${member.email}`}
                      onClick={(e) => e.stopPropagation()}
                      title="Email"
                      className="p-1.5 text-slate-600 hover:text-xperience-purple hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    {member.linkedin && (
                      <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="LinkedIn"
                        className="p-1.5 text-slate-600 hover:text-[#0A66C2] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAskAboutMember(member);
                    }}
                    title="Ask HR Assistant about this leader"
                    className="text-[11px] font-semibold text-xperience-purple hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask Bot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Complete Member Details Modal with Reporting Navigation */}
      {selectedMember && (() => {
        const ancestors = getAncestors(selectedMember.id);
        const directReports = getChildren(selectedMember.id);
        const peers = getPeers(selectedMember);
        const manager = selectedMember.reportsTo ? getMemberById(selectedMember.reportsTo) : null;

        return (
          <div 
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-notification-pop max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#6C47C9] via-[#6A41C9] to-[#7B52DE] text-white p-6 relative shrink-0">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 text-purple-200 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <img 
                    src={selectedMember.image} 
                    alt={selectedMember.name}
                    className="w-18 h-18 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-md mb-1">
                      {selectedMember.level}
                    </span>
                    <h2 className="text-xl font-black">{selectedMember.name}</h2>
                    <p className="text-purple-100 text-xs mt-0.5">{selectedMember.title}</p>
                    <p className="text-purple-200 text-[11px] font-semibold tracking-wide uppercase mt-0.5">
                      {selectedMember.department}
                    </p>
                  </div>
                </div>

                {/* Reporting Chain Breadcrumbs in Modal */}
                {ancestors.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-1.5 text-[11px] text-purple-100 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-purple-300 font-semibold shrink-0">Chain:</span>
                    {ancestors.map((anc) => (
                      <button
                        key={anc.id}
                        onClick={() => setSelectedMember(anc)}
                        className="hover:text-white hover:underline shrink-0 font-medium cursor-pointer"
                      >
                        {anc.name}
                      </button>
                    ))}
                    <span className="text-purple-300">›</span>
                    <span className="font-bold text-white shrink-0">{selectedMember.name}</span>
                  </div>
                )}
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-800 text-xs">
                
                {/* About & Role Scope */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    About & Scope
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-slate-700 leading-relaxed">
                    {selectedMember.summary}
                  </div>
                </div>

                {/* Reports To (Manager) */}
                {manager && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Reports To
                    </div>
                    <button
                      onClick={() => setSelectedMember(manager)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img src={manager.image} alt={manager.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-purple-100" />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-xperience-purple transition-colors">{manager.name}</div>
                          <div className="text-[11px] text-slate-500">{manager.title} • {manager.department}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-xperience-purple group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                )}

                {/* Direct Reports */}
                {directReports.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Direct Reports ({directReports.length})</span>
                      <button
                        onClick={() => {
                          setFocusRootId(selectedMember.id);
                          setViewMode('tree');
                          setSelectedMember(null);
                        }}
                        className="text-[11px] font-bold text-xperience-purple hover:underline"
                      >
                        Focus in Tree →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {directReports.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedMember(c)}
                          className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-left transition-all group cursor-pointer"
                        >
                          <img src={c.image} alt={c.name} className="w-7 h-7 rounded-lg object-cover ring-1 ring-purple-100" />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 group-hover:text-xperience-purple truncate">{c.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{c.title}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team Peers */}
                {peers.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Team Peers (Reporting to {manager?.name})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {peers.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedMember(p)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-xperience-purple text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          <img src={p.image} alt={p.name} className="w-4 h-4 rounded-full object-cover" />
                          <span>{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Contact Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <a 
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-slate-800"
                    >
                      <Mail className="w-4 h-4 text-xperience-purple shrink-0" />
                      <span className="truncate">{selectedMember.email}</span>
                    </a>

                    {selectedMember.phone && selectedMember.phone !== 'N/A' ? (
                      <a 
                        href={`tel:${selectedMember.phone.replace(/\s+/g, '')}`}
                        className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-slate-800"
                      >
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{selectedMember.phone}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                        <Phone className="w-4 h-4 shrink-0" />
                        <span>Phone Not Disclosed</span>
                      </div>
                    )}

                    {selectedMember.linkedin && (
                      <a 
                        href={selectedMember.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="sm:col-span-2 flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-slate-800"
                      >
                        <div className="flex items-center gap-2.5">
                          <Linkedin className="w-4 h-4 text-[#0A66C2] shrink-0" />
                          <span className="font-semibold">View Verified LinkedIn Profile</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
                <button
                  onClick={() => handleCopyContact(selectedMember)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                >
                  {copiedId === selectedMember.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy Info</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleAskAboutMember(selectedMember);
                    setSelectedMember(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6C47C9] to-[#7B52DE] text-white text-xs font-bold shadow-md shadow-xperience-purple/20 hover:opacity-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Ask HR AI</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
