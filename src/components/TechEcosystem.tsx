import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Code,
  FileJson,
  Shield,
  Atom,
  Sparkles,
  Navigation,
  Server,
  Layers,
  Database,
  Link,
  CreditCard,
  ShieldCheck,
  Key,
  Cpu,
  Terminal,
  Zap,
  HelpCircle
} from 'lucide-react';
import { EcosystemTech } from '../types';
import { ECOSYSTEM_STACK } from '../data';

const IconMap: Record<string, any> = {
  Code,
  FileJson,
  Shield,
  Atom,
  Sparkles,
  Navigation,
  Server,
  Layers,
  Database,
  Link,
  CreditCard,
  ShieldCheck,
  Key,
  Cpu,
  Terminal,
  Zap
};

function TechCard({ tech, IconComponent }: { tech: EcosystemTech; IconComponent: any; key?: string }) {
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

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ 
        scale: 1.02, 
        translateY: -3,
        boxShadow: `0 10px 30px -10px ${tech.glowColor}`
      }}
      animate={isMiddleActive ? {
        scale: 1.02,
        translateY: -3,
        boxShadow: `0 10px 30px -10px ${tech.glowColor}`
      } : {
        scale: 1,
        translateY: 0,
        boxShadow: 'none'
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative bg-black rounded-lg p-6 border transition-all duration-300 flex flex-col justify-between min-h-[160px] overflow-hidden ${
        isMiddleActive ? 'border-blue-500/50' : 'border-white/10 hover:border-blue-500/50'
      }`}
    >
      {/* Interactive Colored Glow Backing */}
      <div 
        className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full transition-opacity duration-500 blur-2xl pointer-events-none ${
          isMiddleActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-60'
        }`}
        style={{ backgroundColor: tech.glowColor }}
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div 
            className={`p-2 rounded border transition-colors duration-300 ${
              isMiddleActive ? 'bg-white/10 border-white/20 text-blue-400' : 'bg-white/5 border-white/10 group-hover:bg-white/10 group-hover:border-white/20 text-blue-400'
            }`}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border transition-colors duration-300 ${
            isMiddleActive ? 'bg-white/10 border-white/15 text-white/70' : 'text-white/40 bg-white/5 group-hover:bg-white/10 border-white/5'
          }`}>
            {tech.milestone}
          </span>
        </div>

        <h4 className={`text-base font-black uppercase transition-colors duration-200 ${
          isMiddleActive ? 'text-blue-400' : 'text-white group-hover:text-blue-400'
        }`}>
          {tech.name}
        </h4>
        <p className={`mt-2 text-xs transition-colors duration-200 leading-relaxed ${
          isMiddleActive ? 'text-white/80' : 'text-white/50 group-hover:text-white/80 line-clamp-2'
        }`}>
          {tech.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function TechEcosystem() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend Core', 'Backend & Database', 'E-Commerce & Advanced', 'AI & Modern Dev Tools'];

  const filteredTech = activeCategory === 'All'
    ? ECOSYSTEM_STACK
    : ECOSYSTEM_STACK.filter(tech => tech.category === activeCategory);

  // Group by category if "All" is selected, to present a structured ecosystem bento grid
  const categoriesToRender = activeCategory === 'All'
    ? ['Frontend Core', 'Backend & Database', 'E-Commerce & Advanced', 'AI & Modern Dev Tools']
    : [activeCategory];

  return (
    <section id="tech-ecosystem" className="relative py-24 border-t border-white/10 bg-black overflow-hidden">
      {/* Background Subtle Radial Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none radial-glow-pulse" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Comprehensive Stack
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              The Tech Ecosystem <span className="text-transparent text-stroke-white">Stack</span>
            </h2>
            <p className="mt-3 text-white/50 max-w-xl text-xs sm:text-sm leading-relaxed">
              Every tool, language, runtime, and API included in this syllabus. Hover over items to feel the interactive feedback and view deployment integrations.
            </p>
          </div>

          {/* Quick Filter tabs */}
          <div className="flex flex-wrap gap-2 bg-black p-1.5 rounded-lg border border-white/10 self-start lg:self-auto">
            {categories.map(cat => (
              <button
                key={cat}
                id={`tech-tab-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Containers */}
        <div className="space-y-12">
          {categoriesToRender.map(categoryName => {
            const techsInCategory = filteredTech.filter(t => t.category === categoryName);
            if (techsInCategory.length === 0) return null;

            return (
              <div key={categoryName} className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 pl-2 border-l-2 border-blue-500 ml-1">
                  {categoryName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {techsInCategory.map((tech) => {
                    const IconComponent = IconMap[tech.iconName] || HelpCircle;
                    return (
                      <TechCard
                        key={tech.name}
                        tech={tech}
                        IconComponent={IconComponent}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
