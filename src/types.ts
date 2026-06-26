export interface Resource {
  title: string;
  url: string;
  creator?: string;
  type: 'video' | 'doc' | 'course';
}

export interface Milestone {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  modules: string[];
  resources: Resource[];
}

export interface EcosystemTech {
  name: string;
  category: 'Frontend Core' | 'Backend & Database' | 'E-Commerce & Advanced' | 'AI & Modern Dev Tools';
  milestone: string;
  description: string;
  color: string; // Tailwind glow color group (e.g. 'yellow', 'cyan', 'blue', 'emerald', 'indigo', 'orange', 'purple', 'rose')
  glowColor: string; // inline style rgba or hex for custom drop-shadow hover
  iconName: string; // Lucide icon string
}

export interface CapstoneProject {
  title: string;
  milestone: string;
  milestoneNum: number;
  description: string;
  technologies: string[];
  challenge: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  folderStructure?: string;
  architectureFlow?: string;
}
