/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Play,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  Calendar,
  Code,
  Github,
  Moon,
  Info,
  Clock,
  Layout,
  HelpCircle
} from 'lucide-react';
import { MILESTONES, GENERAL_RESOURCES } from './data';
import { Milestone, Resource } from './types';
import TechEcosystem from './components/TechEcosystem';
import CapstoneProjects from './components/CapstoneProjects';
import BallSurfaceSection from './components/BallSurfaceSection';

// A classy, interactive developer logo depicting a computer screen indicating development
const ClassyLogo = () => (
  <div className="relative group shrink-0 select-none">
    {/* Ambient Outer Glow */}
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
    
    {/* Vector Screen Outer Container */}
    <div className="relative w-9 h-9 bg-black/60 border border-white/15 rounded flex items-center justify-center transition-all duration-300 group-hover:border-blue-500/40">
      <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Computer Screen Frame */}
        <rect x="2" y="3" width="20" height="13" rx="1.5" className="stroke-white/80 group-hover:stroke-blue-400 transition-colors duration-300" />
        {/* Stand Neck */}
        <path d="M12 16v4" className="stroke-white/50 group-hover:stroke-purple-400 transition-colors duration-300" />
        {/* Stand Base */}
        <path d="M8 20h8" className="stroke-white/50 group-hover:stroke-purple-400 transition-colors duration-300" />
        {/* Code Brackets on Screen */}
        <path d="M7 7l-2.5 2.5 2.5 2.5" className="stroke-blue-400 group-hover:stroke-blue-300 transition-colors duration-300" strokeWidth="2" />
        <path d="M17 7l2.5 2.5-2.5 2.5" className="stroke-purple-400 group-hover:stroke-purple-300 transition-colors duration-300" strokeWidth="2" />
        {/* Center slash */}
        <line x1="13" y1="7" x2="11" y2="13" className="stroke-white/30 group-hover:stroke-white/60 transition-colors duration-300" strokeWidth="1.5" />
      </svg>
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<{ id: string, username: string } | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<number[]>([0, 1]); // Expand first two by default
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'pending'>('all');

  // Auth States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Check auth session and fetch progress on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('fswd_token');
      if (!token) {
        // Fallback to local storage for guest session progress
        try {
          const guestSaved = localStorage.getItem('fswd_completed_tasks');
          if (guestSaved) {
            setCompletedTasks(JSON.parse(guestSaved));
          }
        } catch (e) {
          console.error("Failed to load local tasks completion state", e);
        }
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
          // Fetch progress
          const progressRes = await fetch('/api/progress', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            setCompletedTasks(progressData.completedTasks || []);
          }
        } else {
          // Token is invalid/expired, clear it
          localStorage.removeItem('fswd_token');
          // Fallback to local storage
          const guestSaved = localStorage.getItem('fswd_completed_tasks');
          if (guestSaved) {
            setCompletedTasks(JSON.parse(guestSaved));
          }
        }
      } catch (e) {
        console.error("Auth verification failed:", e);
      }
    };

    checkAuth();
  }, []);

  // Save specific task completion state
  const toggleTaskCompletion = async (milestoneId: number, taskIdx: number) => {
    const taskKey = `${milestoneId}-${taskIdx}`;
    let updated: string[];
    if (completedTasks.includes(taskKey)) {
      updated = completedTasks.filter(t => t !== taskKey);
    } else {
      updated = [...completedTasks, taskKey];
    }
    setCompletedTasks(updated);

    if (user) {
      // Save to MongoDB via API
      try {
        const token = localStorage.getItem('fswd_token');
        await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ completedTasks: updated })
        });
      } catch (e) {
        console.error("Failed to save progress to database", e);
      }
    } else {
      // Save to localStorage for guests
      try {
        localStorage.setItem('fswd_completed_tasks', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save local progress", e);
      }
      // Auto-open auth dialog to prompt login & cloud persistence
      setAuthError('Log in to securely save and sync your progress across devices!');
      setAuthMode('login');
      setAuthModalOpen(true);
    }
  };

  // Save completion state for whole milestone/phase (toggle all tasks)
  const toggleMilestoneCompletion = async (milestoneId: number) => {
    const milestone = MILESTONES.find(m => m.id === milestoneId);
    if (!milestone) return;

    const allTaskKeys = milestone.modules.map((_, i) => `${milestoneId}-${i}`);
    const areAllCompleted = allTaskKeys.every(k => completedTasks.includes(k));

    let updated: string[];
    if (areAllCompleted) {
      // Uncheck all in this milestone
      updated = completedTasks.filter(k => !allTaskKeys.includes(k));
    } else {
      // Check all in this milestone (merge and prevent duplicates)
      const otherCompleted = completedTasks.filter(k => !allTaskKeys.includes(k));
      updated = [...otherCompleted, ...allTaskKeys];
    }
    setCompletedTasks(updated);

    if (user) {
      // Save to MongoDB via API
      try {
        const token = localStorage.getItem('fswd_token');
        await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ completedTasks: updated })
        });
      } catch (e) {
        console.error("Failed to save progress to database", e);
      }
    } else {
      // Save to localStorage for guests
      try {
        localStorage.setItem('fswd_completed_tasks', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save local progress", e);
      }
      // Prompt log in
      setAuthError('Log in to securely save and sync your progress across devices!');
      setAuthMode('login');
      setAuthModalOpen(true);
    }
  };

  const toggleExpandMilestone = (id: number) => {
    if (expandedMilestones.includes(id)) {
      setExpandedMilestones(expandedMilestones.filter(mId => mId !== id));
    } else {
      setExpandedMilestones([...expandedMilestones, id]);
    }
  };

  const expandAll = () => {
    setExpandedMilestones(MILESTONES.map(m => m.id));
  };

  const collapseAll = () => {
    setExpandedMilestones([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('fswd_token');
    setUser(null);
    setCompletedTasks([]);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authUsername.trim() || !authPassword) {
      setAuthError('Username and password are required.');
      return;
    }

    setAuthLoading(true);
    try {
      const url = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: authUsername.trim(),
          password: authPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error || 'Authentication failed');
        setAuthLoading(false);
        return;
      }

      // Success setup
      localStorage.setItem('fswd_token', data.token);
      setUser(data.user);
      setAuthModalOpen(false);
      setAuthUsername('');
      setAuthPassword('');
      
      // Load progress and merge with existing guest progress
      const progressRes = await fetch('/api/progress', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        const dbTasks: string[] = progressData.completedTasks || [];
        
        // Merge guest progress with database progress to prevent losing guest work!
        const localTasks = completedTasks;
        const mergedTasks = Array.from(new Set([...dbTasks, ...localTasks]));
        
        setCompletedTasks(mergedTasks);
        
        // If there is new local progress that was not on the server, sync it to database
        if (localTasks.length > 0) {
          try {
            await fetch('/api/progress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
              },
              body: JSON.stringify({ completedTasks: mergedTasks })
            });
          } catch (e) {
            console.error("Failed to sync merged local progress on login", e);
          }
        }
        
        // Clean guest storage
        localStorage.removeItem('fswd_completed_tasks');
      }
    } catch (err) {
      console.error("Auth request error:", err);
      setAuthError('Connection error. Is the server running?');
    } finally {
      setAuthLoading(false);
    }
  };

  // Filter milestones and resources based on search and tab selections
  const filteredMilestones = MILESTONES.filter(m => {
    const isCompleted = m.modules.every((_, i) => completedTasks.includes(`${m.id}-${i}`));
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'completed' && isCompleted) ||
      (filterType === 'pending' && !isCompleted);

    const matchesSearch = 
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.modules.some(mod => mod.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.resources.some(res => 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (res.creator && res.creator.toLowerCase().includes(searchQuery.toLowerCase()))
      );

    return matchesFilter && matchesSearch;
  });

  // Calculate stats based on task completion
  const totalTasksCount = MILESTONES.reduce((acc, m) => acc + m.modules.length, 0);
  const completedCount = completedTasks.length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

  const completedMilestonesCount = MILESTONES.filter(m => 
    m.modules.every((_, i) => completedTasks.includes(`${m.id}-${i}`))
  ).length;
  const totalMilestonesCount = MILESTONES.length;

  // Helper to determine resource icon
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return <Play className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'doc':
        return <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'course':
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      default:
        return <ExternalLink className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600/30 selection:text-white relative overflow-x-hidden w-full">
      
      {/* Header Navigation */}
      <nav className="h-20 flex items-center justify-between px-4 md:px-10 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-3">
          <ClassyLogo />
          <span className="font-bold tracking-tighter text-xs min-[420px]:text-sm sm:text-lg md:text-xl text-white select-none">FULLSTACK.MASTER</span>
        </div>
        <div className="hidden md:flex gap-4 lg:gap-8 text-[10px] font-bold uppercase tracking-widest text-white/50">
          <a href="#curriculum" className="text-blue-500 hover:text-white transition-colors">Roadmap</a>
          <a href="#tech-ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
          <a href="#capstone-projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#reference-vault" className="hover:text-white transition-colors">Vault</a>
        </div>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden lg:inline text-[10px] font-mono font-bold text-white/50 tracking-wider">
              [ {user.username.toUpperCase()} ]
            </span>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 sm:px-5 sm:py-2 bg-white text-black font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-full hover:bg-red-600 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => {
              setAuthError('');
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="px-3 py-1.5 sm:px-5 sm:py-2 bg-blue-600 text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-full hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
          >
            Log In
          </button>
        )}
      </nav>

      {/* Hero Header Block */}
      <header className="relative pt-24 pb-16 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80 pointer-events-none" />
        
        {/* Blue/Purple Ambient Light Flares */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-12 right-1/4 translate-x-1/2 w-[350px] h-[350px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 mb-6 mx-auto">
            <Sparkles className="w-3 h-3 text-blue-400" />
            Curriculum Roadmap Updated
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] uppercase max-w-5xl mx-auto mb-8 px-4 break-words">
            Modern<br/>Architecture<br/>
            <span className="text-transparent text-stroke-white">Mastery</span>
          </h1>

          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-12">
            An elite, comprehensive path from orientation and AI prompt engineering to production payment gates, offline database integrations, and advanced AI-Assisted local workflows.
          </p>

          {/* Quick Stats Bento Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 p-5 rounded-lg border border-white/10 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white italic">12</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Milestones</span>
            </div>
            <div className="bg-white/5 p-5 rounded-lg border border-white/10 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white italic">85+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Resources</span>
            </div>
            <div className="bg-white/5 p-5 rounded-lg border border-white/10 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white italic">10</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Capstones</span>
            </div>
            <div className="bg-white/5 p-5 rounded-lg border border-white/10 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-blue-500 italic">{progressPercent}%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Completed</span>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Curriculum Workspace */}
      <BallSurfaceSection id="curriculum" className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12 items-start">
          
          {/* Left Sidebar Curriculum Overview & Progress */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Curriculum Tracker</div>
            
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
              <div className="text-xs font-bold text-blue-400 mb-1 italic">ACTIVE TRACK</div>
              <div className="font-bold text-lg leading-tight text-white mb-4">FSWD Certifications</div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-white/40">
                  <span>YOUR PROGRESS</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-1.5 bg-white/10 w-full rounded-full">
                  <div className="h-1.5 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="text-[10px] text-white/30 italic uppercase tracking-wider">
                  {completedMilestonesCount} of {totalMilestonesCount} phases completed ({completedCount} of {totalTasksCount} tasks checked)
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-5 bg-blue-600/10 border border-blue-500/20 rounded-lg">
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Mass Actions</div>
              <div className="flex flex-col gap-2">
                <button
                  id="expand-all-btn"
                  onClick={expandAll}
                  className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-mono text-white/80 hover:text-white transition-all"
                >
                  [+] EXPAND ALL MODULES
                </button>
                <button
                  id="collapse-all-btn"
                  onClick={collapseAll}
                  className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-mono text-white/80 hover:text-white transition-all"
                >
                  [-] COLLAPSE ALL MODULES
                </button>
              </div>
            </div>
          </div>

          {/* Center Curriculum Timeline (3/4 Columns) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
              
              {/* Quick Filter tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="filter-all-btn"
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white border border-blue-500 shadow-md'
                      : 'text-white/50 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  All Milestones
                </button>
                <button
                  id="filter-completed-btn"
                  onClick={() => setFilterType('completed')}
                  className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterType === 'completed'
                      ? 'bg-blue-600 text-white border border-blue-500 shadow-md'
                      : 'text-white/50 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  Completed ({completedMilestonesCount})
                </button>
                <button
                  id="filter-pending-btn"
                  onClick={() => setFilterType('pending')}
                  className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterType === 'pending'
                      ? 'bg-blue-600 text-white border border-blue-500 shadow-md'
                      : 'text-white/50 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  Pending ({totalMilestonesCount - completedMilestonesCount})
                </button>
              </div>

              {/* Smart Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  id="milestone-search-input"
                  type="text"
                  placeholder="SEARCH TOPICS OR BLUEPRINTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 focus:border-white/30 focus:outline-none rounded py-2 pl-10 pr-4 text-xs text-white placeholder-white/20 uppercase tracking-wider transition-all font-mono"
                />
              </div>
            </div>

            {/* Vertical Timeline Roadmap */}
            <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-8">
              
              {filteredMilestones.map((milestone) => {
                const isCompleted = milestone.modules.every((_, i) => completedTasks.includes(`${milestone.id}-${i}`));
                const milestoneCompletedCount = milestone.modules.filter((_, i) => completedTasks.includes(`${milestone.id}-${i}`)).length;
                const milestoneProgressPercent = milestone.modules.length > 0 ? Math.round((milestoneCompletedCount / milestone.modules.length) * 100) : 0;
                const isExpanded = expandedMilestones.includes(milestone.id);

                return (
                  <div key={milestone.id} className="relative group/milestone">
                    
                    {/* Visual Timeline Marker Node */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full border-2 border-[#050505] bg-white/20 group-hover/milestone:bg-blue-500 group-hover/milestone:border-blue-400 transition-all duration-300 z-10"
                      style={{
                        backgroundColor: isCompleted ? '#2563eb' : undefined,
                        borderColor: isCompleted ? '#2563eb' : undefined
                      }}
                    />

                    {/* Main Card Container */}
                    <div className="bg-black border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 overflow-hidden">
                      
                      {/* Card Header (Interactive) */}
                      <div 
                        onClick={() => toggleExpandMilestone(milestone.id)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          {/* Interactive checkbox */}
                          <button
                            id={`milestone-check-${milestone.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMilestoneCompletion(milestone.id);
                            }}
                            className={`mt-1.5 p-1 rounded border text-white transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-blue-600 border-blue-500 hover:bg-blue-700'
                                : 'border-white/10 hover:border-white/30 bg-transparent text-transparent hover:text-white/30'
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>

                          <div>
                            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest italic">PHASE 0{milestone.id}</span>
                              <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/5">{milestone.duration}</span>
                              <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                                {milestoneProgressPercent}% Done
                              </span>
                            </div>
                            <h3 className={`text-xl font-black uppercase tracking-tight transition-all duration-200 ${isCompleted ? 'text-white/40 line-through' : 'text-white'}`}>
                              {milestone.title}
                            </h3>
                            <p className="text-xs text-white/50 mt-1 max-w-3xl leading-relaxed">
                              {milestone.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pl-8 sm:pl-0 self-start sm:self-auto text-white/30 group-hover/milestone:text-white/60 transition-colors">
                          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">INSPECT FLOW</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Expandable Module Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="border-t border-white/10 overflow-hidden bg-white/[0.01]"
                          >
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
                              
                              {/* Core syllabus topic modules */}
                              <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between pb-1 border-b border-white/5">
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                    <Code className="w-3.5 h-3.5 text-blue-500" /> Syllabus Focus Modules
                                  </h4>
                                </div>
                                <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${milestoneProgressPercent}%` }} />
                                </div>
                                <ul className="space-y-2.5 pl-0.5">
                                  {milestone.modules.map((mod, i) => {
                                    const taskKey = `${milestone.id}-${i}`;
                                    const isTaskCompleted = completedTasks.includes(taskKey);

                                    return (
                                      <li 
                                        key={i} 
                                        onClick={() => toggleTaskCompletion(milestone.id, i)}
                                        className="text-xs text-white/80 flex items-start gap-3 leading-relaxed hover:text-white cursor-pointer select-none group/task py-1"
                                      >
                                        <button
                                          id={`task-check-${milestone.id}-${i}`}
                                          className={`mt-0.5 p-0.5 rounded border text-white transition-all shrink-0 ${
                                            isTaskCompleted
                                              ? 'bg-blue-600 border-blue-500 hover:bg-blue-700'
                                              : 'border-white/10 group-hover/task:border-white/30 bg-transparent text-transparent group-hover/task:text-white/20'
                                          }`}
                                        >
                                          <CheckCircle className="w-3 h-3" />
                                        </button>
                                        <span className={`transition-all duration-200 ${isTaskCompleted ? 'text-white/40 line-through' : 'text-white/80'}`}>
                                          <span className="text-blue-500/60 font-mono text-[10px] font-bold mr-1.5">0{i + 1}.</span>
                                          {mod}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>

                              {/* Curated free resource blueprints */}
                              <div className="lg:col-span-3 space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                  <Award className="w-3.5 h-3.5 text-blue-500" /> Free Resource Blueprints
                                </h4>
                                <div className="grid grid-cols-1 gap-2.5">
                                  {milestone.resources.map((resource, i) => (
                                    <a
                                      key={i}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group/link flex items-center justify-between p-3.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                    >
                                      <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 rounded bg-[#0a0a0a] border border-white/10 shrink-0">
                                          {getResourceIcon(resource.type)}
                                        </div>
                                        <div className="overflow-hidden">
                                          <h5 className="text-xs font-bold text-white group-hover/link:text-blue-400 transition-colors truncate">
                                            {resource.title}
                                          </h5>
                                          {resource.creator && (
                                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-0.5">
                                              {resource.creator}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover/link:text-white/60 transition-colors shrink-0 ml-4" />
                                    </a>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>
                );
              })}

              {filteredMilestones.length === 0 && (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-lg bg-white/[0.01]">
                  <Info className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">No Phases Located</h3>
                  <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">Modify your search query filters or refine terms above.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </BallSurfaceSection>

      {/* Tech Ecosystem Stack Section */}
      <BallSurfaceSection>
        <TechEcosystem />
      </BallSurfaceSection>

      {/* Curated Capstone Projects Grid Section */}
      <BallSurfaceSection>
        <CapstoneProjects />
      </BallSurfaceSection>

      {/* bottom Reference Resource Vault Section */}
      <BallSurfaceSection id="reference-vault" className="relative py-24 border-t border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-4">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              Reference Vault
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">
              General <span className="text-transparent text-stroke-white">Free Platforms</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/50 leading-relaxed">
              Permanent bookmark platforms to aid your code challenges. These provide infinite learning scopes alongside our structured roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GENERAL_RESOURCES.map((vaultItem) => (
              <a
                key={vaultItem.title}
                href={vaultItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-lg border border-white/10 bg-black hover:bg-white/[0.02] hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{vaultItem.creator}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {vaultItem.title}
                  </h4>
                  <p className="mt-2 text-xs text-white/50 leading-relaxed group-hover:text-white/75 transition-colors">
                    {vaultItem.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </BallSurfaceSection>

      {/* High-End Professional Footer */}
      <footer className="border-t border-white/10 bg-[#030303]/90 relative z-10 overflow-hidden py-16 md:py-24">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 pb-16 border-b border-white/5">
            {/* Branding Column */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <ClassyLogo />
                <span className="font-bold tracking-tighter text-xl text-white select-none">FULLSTACK.MASTER</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed max-w-sm">
                An elite engineering-oriented curriculum guiding developers from prompt engineering foundations to highly complex full-stack microservices, real-time sync databases, and multi-user scaling.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-white/40">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Navigations</h4>
              <ul className="space-y-2 text-xs font-mono">
                <li>
                  <a href="#curriculum" className="text-white/60 hover:text-white hover:underline transition-all">[01] ROADMAP</a>
                </li>
                <li>
                  <a href="#tech-ecosystem" className="text-white/60 hover:text-white hover:underline transition-all">[02] ECOSYSTEM</a>
                </li>
                <li>
                  <a href="#capstone-projects" className="text-white/60 hover:text-white hover:underline transition-all">[03] PROJECTS</a>
                </li>
                <li>
                  <a href="#reference-vault" className="text-white/60 hover:text-white hover:underline transition-all">[04] VAULT</a>
                </li>
              </ul>
            </div>

            {/* Elite Creator Credit */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Authority & Design</h4>
              <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest italic mb-1">CHIEF ARCHITECT</div>
                <div className="font-black text-sm uppercase tracking-wider text-white">Sayem Al Amin</div>
                <div className="text-[9px] font-mono text-white/30 mt-1 uppercase">Full-Stack System Engineer</div>
              </div>
            </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[11px] font-mono text-white/45 uppercase tracking-wider">
                © {new Date().getFullYear()} FULL-STACK ROADMAP. Coordinated and created by <span className="text-white font-bold">Sayem Al Amin</span>.
              </p>
              <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                Curriculum resources synchronized with real-world developer standards. Authorized execution only.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/25 text-white/55 hover:text-white transition-all duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Popup Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-lg shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <ClassyLogo />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                  {authMode === 'login' ? 'Log In' : 'Create Account'}
                </h3>
                <p className="text-[10px] text-white/50 mt-1.5 uppercase tracking-wider font-bold">
                  {authMode === 'login' ? 'Save and track your curriculum progress' : 'Get started to sync your progress securely'}
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] rounded uppercase tracking-wider font-mono text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="ENTER USERNAME"
                    className="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white placeholder-white/20 uppercase tracking-widest font-mono focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="ENTER PASSWORD"
                    className="w-full bg-black border border-white/10 rounded px-4 py-2.5 text-xs text-white placeholder-white/20 uppercase tracking-widest font-mono focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest py-3 rounded transition-colors cursor-pointer"
                >
                  {authLoading ? 'PROCESSING...' : authMode === 'login' ? 'LOG IN' : 'REGISTER'}
                </button>
              </form>

              <div className="mt-6 text-center text-xs">
                <span className="text-white/40 font-medium">
                  {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  onClick={() => {
                    setAuthError('');
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                  }}
                  className="text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider text-[11px] ml-1 cursor-pointer underline underline-offset-4"
                >
                  {authMode === 'login' ? 'Register Now' : 'Log In instead'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

