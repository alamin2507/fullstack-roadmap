import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Cpu,
  Layers,
  Terminal,
  Calendar,
  Code2,
  ExternalLink,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { CapstoneProject } from '../types';
import { CAPSTONE_PROJECTS } from '../data';

function ProjectCard({ project, idx, isExpanded, onToggle }: { project: CapstoneProject; idx: number; isExpanded: boolean; onToggle: () => void; key?: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMiddleActive, setIsMiddleActive] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMiddleActive(entry.isIntersecting);
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  const diffColors = {
    Beginner: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    Intermediate: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
    Advanced: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    Expert: 'text-rose-400 border-rose-500/20 bg-rose-500/5'
  }[project.difficulty];

  return (
    <motion.div
      ref={cardRef}
      layout="position"
      className={`bg-[#050505] border rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl group ${
        isMiddleActive ? 'border-blue-500/60 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.25)]' : 'border-white/10 hover:border-blue-500/50'
      }`}
    >
      <div>
        {/* VSCode/Terminal Style Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isMiddleActive ? 'bg-red-500' : 'bg-red-500/30 group-hover:bg-red-500/70'} transition-colors`} />
            <div className={`w-2 h-2 rounded-full ${isMiddleActive ? 'bg-yellow-500' : 'bg-yellow-500/30 group-hover:bg-yellow-500/70'} transition-colors`} />
            <div className={`w-2 h-2 rounded-full ${isMiddleActive ? 'bg-green-500' : 'bg-green-500/30 group-hover:bg-green-500/70'} transition-colors`} />
            <span className="ml-2.5 text-[9px] font-mono text-white/40 uppercase tracking-widest select-none">
              project_0{idx + 1}.tsx
            </span>
          </div>
          <div className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase tracking-wider ${diffColors}`}>
            {project.difficulty}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded transition-colors duration-300 ${
              isMiddleActive ? 'text-blue-300 bg-blue-500/10 border-blue-500/20' : 'text-blue-400 bg-white/5 border border-white/10'
            }`}>
              {project.milestone}
            </span>
          </div>

          <h3 className={`text-xl font-black uppercase transition-colors duration-200 ${
            isMiddleActive ? 'text-blue-400' : 'text-white group-hover:text-blue-400'
          }`}>
            {project.title}
          </h3>
          
          <p className="mt-2 text-xs text-white/50 leading-relaxed">
            {project.description}
          </p>

          {/* Technologies Pills */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.technologies.map(tech => (
              <span key={tech} className="px-2.5 py-1 bg-white/5 border border-white/5 text-[9px] font-mono font-bold text-white/60 rounded">
                {tech}
              </span>
            ))}
          </div>

          {/* Challenge Box */}
          <div className={`mt-5 p-4 rounded border transition-all duration-300 ${
            isMiddleActive ? 'bg-white/[0.02] border-blue-500/20' : 'bg-white/[0.01] border-white/10 group-hover:bg-white/[0.02]'
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                Core Architectural Challenge
              </span>
            </div>
            <p className="text-xs text-white/70 pl-4 border-l border-blue-500/30 leading-relaxed">
              {project.challenge}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer for Expander Toggle */}
      <div className="px-6 py-4 border-t border-white/10 bg-white/[0.01] flex flex-col gap-4">
        <button
          id={`project-expand-btn-${idx}`}
          onClick={onToggle}
          className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-200 w-full cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
            {isExpanded ? 'Hide pipeline' : 'Inspect Folder & Flow'}
          </span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 pt-2 overflow-hidden"
            >
              {/* Folder Tree Codeblock */}
              {project.folderStructure && (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Folder Blueprint:</span>
                  <pre className="p-4 bg-black rounded border border-white/10 font-mono text-[11px] text-blue-300 overflow-x-auto">
                    <code>{project.folderStructure}</code>
                  </pre>
                </div>
              )}

              {/* Pipeline / Architecture Flow */}
              {project.architectureFlow && (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Operational Pipeline:</span>
                  <div className="p-4 bg-black rounded border border-white/10 font-mono text-[11px] text-white/50 leading-relaxed">
                    {project.architectureFlow}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function CapstoneProjects() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredProjects = CAPSTONE_PROJECTS.filter(project => {
    const matchesDiff = filterDifficulty === 'All' || project.difficulty === filterDifficulty;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          project.challenge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  return (
    <section id="capstone-projects" className="relative py-24 border-t border-white/10 bg-black overflow-hidden">
      {/* Visual Ambient Glows */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            Production Proofs
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            Curated Capstone <span className="text-transparent text-stroke-white">Projects</span>
          </h2>
          <p className="mt-3 text-white/50 max-w-xl text-xs sm:text-sm leading-relaxed">
            The core projects built throughout the roadmap. Ditch generic todo apps; these build functional competency in Stripe Webhooks, Local LLMs, and secure JWT middleware.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-black p-4 rounded-lg border border-white/10 backdrop-blur-sm">
          {/* Difficulty Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {difficulties.map(diff => (
              <button
                key={diff}
                id={`project-tab-${diff.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  filterDifficulty === diff
                    ? 'bg-blue-600 text-white border border-blue-500'
                    : 'text-white/40 hover:text-white border border-transparent'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              id="project-search-input"
              type="text"
              placeholder="SEARCH TECH, CHALLENGES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 focus:border-white/30 focus:outline-none rounded py-2 pl-10 pr-4 text-xs text-white placeholder-white/20 uppercase tracking-wider font-mono transition-all duration-200"
            />
          </div>
        </div>

        {/* Capstone Projects Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <ProjectCard
                key={project.title}
                project={project}
                idx={idx}
                isExpanded={isExpanded}
                onToggle={() => toggleExpand(idx)}
              />
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-16 border border-dashed border-white/10 rounded-lg bg-white/[0.01]">
              <Code2 className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No projects match search query.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
