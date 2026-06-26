import { Milestone, EcosystemTech, CapstoneProject } from './types';

export const MILESTONES: Milestone[] = [
  {
    id: 0,
    title: "Orientation & AI Mindset",
    subtitle: "Prepare your local dev workspace and embrace prompt-engineering workflows.",
    duration: "1 Week",
    modules: [
      "Local workstation configuration (Node, Git, IDE)",
      "Git & GitHub basics",
      "Node.js installer mechanics",
      "Prompt design principles",
      "AI co-piloting philosophy & IDE integrations"
    ],
    resources: [
      { title: "Git & GitHub for Beginners", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", creator: "freeCodeCamp (YouTube)", type: "video" },
      { title: "VS Code Setup for Web Dev", url: "https://www.youtube.com/watch?v=fnPhJHN0jTE", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "Node.js Install & Setup", url: "https://www.youtube.com/watch?v=TlB_eWDSMt4", creator: "The Net Ninja (YouTube)", type: "video" },
      { title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai", creator: "Official Docs", type: "doc" },
      { title: "Andrew Ng — Prompt Engineering for Developers", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", creator: "DeepLearning.AI (Free Course)", type: "course" }
    ]
  },
  {
    id: 1,
    title: "HTML, CSS & GitHub",
    subtitle: "Master core document semantics, modern CSS layouts (Flexbox, Grid), and production Git workflows.",
    duration: "2 Weeks",
    modules: [
      "Semantic HTML5 tag boundaries",
      "CSS core fundamentals (Selectors, Cascade, Inheritance)",
      "The CSS Box Model",
      "Flexbox and Grid 2D alignments",
      "GitHub pull request, branching & conflict resolution workflows"
    ],
    resources: [
      { title: "HTML Full Course", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg", creator: "freeCodeCamp (YouTube)", type: "video" },
      { title: "HTML Crash Course", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "MDN HTML Docs", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", creator: "Mozilla Developer Network", type: "doc" },
      { title: "CSS Full Course", url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", creator: "freeCodeCamp (YouTube)", type: "video" },
      { title: "CSS Crash Course", url: "https://www.youtube.com/watch?v=yfoY53QXEnI", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "CSS Box Model", url: "https://www.youtube.com/watch?v=rIO5326FgPE", creator: "Kevin Powell (YouTube)", type: "video" },
      { title: "Flexbox in 15 Minutes", url: "https://www.youtube.com/watch?v=fYq5PXgSsbE", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "CSS Grid in 20 Minutes", url: "https://www.youtube.com/watch?v=9zBsdzdE4sM", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "Kevin Powell Full CSS Flexbox Course", url: "https://www.youtube.com/watch?v=u044iM9xsWU", creator: "Kevin Powell (YouTube)", type: "video" },
      { title: "MDN CSS Docs", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", creator: "Mozilla Developer Network", type: "doc" },
      { title: "Git & GitHub Crash Course", url: "https://www.youtube.com/watch?v=SWYqp7iY_Tc", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "Git for Beginners", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9goXbgTDQ0n_4TBzOO0ocPR", creator: "The Net Ninja (YouTube Playlist)", type: "video" },
      { title: "Official Git Docs", url: "https://git-scm.com/doc", creator: "Git Core Team", type: "doc" },
      { title: "GitHub Docs", url: "https://docs.github.com/en/get-started", creator: "GitHub Guides", type: "doc" }
    ]
  },
  {
    id: 2,
    title: "JavaScript Foundations",
    subtitle: "Dive deep into variables, types, loops, standard control flow, functions, and arrays.",
    duration: "2 Weeks",
    modules: [
      "JavaScript runtime execution context & variables",
      "Primitive types vs Reference types",
      "Functions as first-class citizens",
      "Array methods & Object structural mutations",
      "Core logic algorithms & problem solving techniques"
    ],
    resources: [
      { title: "JavaScript Full Course", url: "https://www.youtube.com/watch?v=jS4aFq5-91M", creator: "freeCodeCamp (YouTube)", type: "video" },
      { title: "JavaScript Crash Course", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "JavaScript Beginner Tutorial", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9i9Ae2D9Ee1RvylH38dKuET", creator: "The Net Ninja (YouTube Playlist)", type: "video" },
      { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", creator: "Mozilla Developer Network", type: "doc" },
      { title: "javascript.info (best free JS textbook)", url: "https://javascript.info", creator: "Ilya Kantor", type: "doc" },
      { title: "JS Arrays Explained", url: "https://www.youtube.com/watch?v=7W4pQQ20nJg", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "JS Objects Explained", url: "https://www.youtube.com/watch?v=ZunUF_WGMb4", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "JS Functions", url: "https://www.youtube.com/watch?v=xUI5Tsl2JpY", creator: "The Net Ninja (YouTube)", type: "video" },
      { title: "Problem Solving with JS", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", creator: "freeCodeCamp JavaScript Algorithms", type: "video" }
    ]
  },
  {
    id: 3,
    title: "ES6+ JavaScript",
    subtitle: "Adopt modern JavaScript standard iterations, async processing, Closures, and high-order methods.",
    duration: "2 Weeks",
    modules: [
      "Destructuring, Spread, and Rest syntax configurations",
      "Immutability patterns using arrow functions",
      "High-order array methods (Map, Filter, Reduce)",
      "Lexical scope & Javascript Closures",
      "Asynchronous patterns (Promises, Async/Await mechanics)"
    ],
    resources: [
      { title: "ES6 JavaScript Full Tutorial", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gKfw25slm4CUDUcM_sXdml", creator: "The Net Ninja (YouTube Playlist)", type: "video" },
      { title: "ES6 Crash Course", url: "https://www.youtube.com/watch?v=WZQc7RUAg18", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "Array Methods (map, filter, reduce)", url: "https://www.youtube.com/watch?v=R8rmfD9Y5-c", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "Closures Explained", url: "https://www.youtube.com/watch?v=3a0I8ICR1Vg", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "Async/Await & Promises", url: "https://www.youtube.com/watch?v=ZYb_ZU8LNxs", creator: "The Net Ninja (YouTube)", type: "video" },
      { title: "javascript.info ES6 section", url: "https://javascript.info/js", creator: "Ilya Kantor", type: "doc" }
    ]
  },
  {
    id: 4,
    title: "TypeScript",
    subtitle: "Enforce static types, interfaces, structural objects, OOP paradigms, and robust generics.",
    duration: "2 Weeks",
    modules: [
      "Type compilation & tsconfig setup rules",
      "Interfaces vs Types",
      "Object-Oriented Programming (Classes, inheritance, encapsulation)",
      "Generics & type assertions",
      "Advanced utility types and safety guards"
    ],
    resources: [
      { title: "TypeScript Full Course", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI", creator: "The Net Ninja (YouTube Playlist)", type: "video" },
      { title: "TypeScript Crash Course", url: "https://www.youtube.com/watch?v=BCg4U1FzODs", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "TypeScript OOP", url: "https://www.youtube.com/watch?v=nUK9Jofkc0M", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "Official TypeScript Docs (Handbook)", url: "https://www.typescriptlang.org/docs/handbook/intro.html", creator: "TypeScript Team", type: "doc" },
      { title: "TypeScript Generics", url: "https://www.youtube.com/watch?v=t0qQSujSslQ", creator: "Matt Pocock (YouTube)", type: "video" },
      { title: "Total TypeScript Free Tutorials", url: "https://www.totaltypescript.com/tutorials", creator: "Matt Pocock", type: "course" }
    ]
  },
  {
    id: 5,
    title: "React",
    subtitle: "Unlock declarative UI, advanced state-hooks, CSS utilities, and raw DOM manipulation.",
    duration: "3 Weeks",
    modules: [
      "Virtual DOM reconciliations & JSX syntax",
      "Component lifecycle, props, and custom hooks",
      "State preservation & useState/useEffect dependencies",
      "Tailwind CSS class composition & DaisyUI",
      "Browser DOM vs Virtual DOM manipulation (Module 28)"
    ],
    resources: [
      { title: "React Full Course 2024", url: "https://www.youtube.com/watch?v=x4rFhThSX04", creator: "freeCodeCamp (YouTube)", type: "video" },
      { title: "React Crash Course", url: "https://www.youtube.com/watch?v=sBws8MSXN7A", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "React Tutorial", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d", creator: "The Net Ninja (YouTube Playlist)", type: "video" },
      { title: "Official React Docs", url: "https://react.dev", creator: "React Team", type: "doc" },
      { title: "React Hooks", url: "https://www.youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY5u5hOjf-h", creator: "Web Dev Simplified (YouTube Playlist)", type: "video" },
      { title: "useState & useEffect", url: "https://www.youtube.com/watch?v=lAW1Jmmr9hc", creator: "Codevolution (YouTube)", type: "video" },
      { title: "Tailwind CSS Full Course", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HEGhw", creator: "The Net Ninja (YouTube Playlist)", type: "video" },
      { title: "Official Tailwind Docs", url: "https://tailwindcss.com/docs", creator: "Tailwind Labs", type: "doc" },
      { title: "DaisyUI Docs", url: "https://daisyui.com/docs/install/", creator: "DaisyUI", type: "doc" },
      { title: "JavaScript DOM Manipulation", url: "https://www.youtube.com/watch?v=5fb2aPlgoys", creator: "freeCodeCamp (YouTube)", type: "video" },
      { title: "DOM Crash Course", url: "https://www.youtube.com/watch?v=0ik6X4DJKCc", creator: "Traversy Media (YouTube)", type: "video" }
    ]
  },
  {
    id: 6,
    title: "Next.js",
    subtitle: "Leverage React Server Components, server-side caching, static generation, and edge networks.",
    duration: "2 Weeks",
    modules: [
      "App Router and route structure rules",
      "React Server Components (RSC) vs Client Components",
      "Data fetching, mutations & Server Actions",
      "Rendering strategies: SSR, CSR, and ISR optimizations",
      "Dynamic SEO meta setups"
    ],
    resources: [
      { title: "Next.js Full Course", url: "https://www.youtube.com/watch?v=KjY94sAKLlw", creator: "freeCodeCamp (YouTube)", type: "video" },
      { title: "Next.js 14 Crash Course", url: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "Next.js for Beginners", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jClk8wl1yJcN3Zlrr8YSA1", creator: "The Net Ninja (YouTube Playlist)", type: "video" },
      { title: "Official Next.js Docs", url: "https://nextjs.org/docs", creator: "Vercel Next.js Team", type: "doc" },
      { title: "Next.js Rendering (SSR/CSR/ISR)", url: "https://www.youtube.com/watch?v=Sklc_fQBmcs", creator: "Fireship (YouTube)", type: "video" }
    ]
  },
  {
    id: 7,
    title: "Authentication",
    subtitle: "Integrate session protocols, secure cookies, JWTs, OAuth login providers, and BetterAuth.",
    duration: "2 Weeks",
    modules: [
      "Session vs Token-based authentication mechanics",
      "NextAuth.js configurations",
      "Email/Password and OAuth credentials loops",
      "JWT cryptography signing, validation, and storage",
      "Modern fast BetterAuth layouts"
    ],
    resources: [
      { title: "NextAuth.js / Authentication", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT", creator: "The Net Ninja (YouTube Playlist)", type: "video" },
      { title: "JWT Authentication Explained", url: "https://www.youtube.com/watch?v=7Q17ubqLfaM", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "Google OAuth Tutorial", url: "https://www.youtube.com/watch?v=w2h54xz6Ndw", creator: "Codevolution (YouTube)", type: "video" },
      { title: "BetterAuth Official Docs", url: "https://www.better-auth.com/docs", creator: "BetterAuth Engine", type: "doc" },
      { title: "Email & Password Auth in Next.js", url: "https://www.youtube.com/watch?v=w2h54xz6Ndw", creator: "Traversy Media (YouTube)", type: "video" }
    ]
  },
  {
    id: 8,
    title: "Node.js, Express & MongoDB",
    subtitle: "Architect RESTful backend APIs, construct Express pipelines, and spin up NoSQL MongoDB databases.",
    duration: "3 Weeks",
    modules: [
      "V8 engine runtime architecture",
      "Express Routing, request/response models, and custom middlewares",
      "MongoDB Atlas cluster configurations",
      "Aggregation pipelines & indexing performance optimizations",
      "RESTful API design compliance & CRUD operations"
    ],
    resources: [
      { title: "Node.js Full Course", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jszmQoOs5jY6qB7Ql1X7bH", creator: "The Net Ninja (YouTube Playlist)", type: "video" },
      { title: "Express.js Crash Course", url: "https://www.youtube.com/watch?v=L72fhGm1tfE", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "Node.js & Express REST API", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", creator: "freeCodeCamp (YouTube)", type: "video" },
      { title: "Official Node.js Docs", url: "https://nodejs.org/en/docs", creator: "Node.js Core", type: "doc" },
      { title: "Official Express Docs", url: "https://expressjs.com/en/4x/api.html", creator: "Express Team", type: "doc" },
      { title: "MongoDB Full Course", url: "https://www.youtube.com/watch?v=ExcRbA7fy_A", creator: "freeCodeCamp (YouTube)", type: "video" },
      { title: "MongoDB Crash Course", url: "https://www.youtube.com/watch?v=ofme2o29ngU", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "MongoDB Aggregation Pipeline", url: "https://www.youtube.com/watch?v=A3jvoE0jGdE", creator: "The Net Ninja (YouTube)", type: "video" },
      { title: "Official MongoDB Docs", url: "https://www.mongodb.com/docs/manual/", creator: "MongoDB Inc", type: "doc" },
      { title: "MongoDB Atlas Getting Started", url: "https://www.mongodb.com/docs/atlas/getting-started/", creator: "MongoDB Atlas Team", type: "doc" },
      { title: "REST API Design Principles", url: "https://www.youtube.com/watch?v=Q-BpqyOT3a8", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "CRUD App with Node, Express, MongoDB", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9itC5TuhONemOrAXoIkZeiq", creator: "The Net Ninja (YouTube Playlist)", type: "video" }
    ]
  },
  {
    id: 9,
    title: "Full Stack Project 1 (Stripe Payments)",
    subtitle: "Deploy fully transactional architectures combining Stripe checkouts, secure webhooks, and RBAC authorization.",
    duration: "2 Weeks",
    modules: [
      "Stripe payment gateway API structures",
      "Securing asynchronous Stripe Webhooks",
      "Role-Based Access Control (RBAC) middleware patterns",
      "Token-based RBAC verification pipelines",
      "Deployment strategies: Render, Vercel & continuous integrations"
    ],
    resources: [
      { title: "Stripe Payment Integration", url: "https://www.youtube.com/watch?v=1r-F3FIONl8", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "Stripe Webhooks Explained", url: "https://www.youtube.com/watch?v=oYSS4B4uXNk", creator: "Fireship (YouTube)", type: "video" },
      { title: "Official Stripe Docs", url: "https://stripe.com/docs", creator: "Stripe Developer Relations", type: "doc" },
      { title: "RBAC with Node & Express", url: "https://www.youtube.com/watch?v=jI4K7L-LI58", creator: "Codevolution (YouTube)", type: "video" },
      { title: "JWT + RBAC Alignment", url: "https://www.youtube.com/watch?v=mbsmsi7l3r4", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "Deploy Node + Express to Render", url: "https://www.youtube.com/watch?v=l134cBAJCuc", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "Deploy Next.js to Vercel", url: "https://vercel.com/docs/deployments/overview", creator: "Vercel Guides", type: "doc" }
    ]
  },
  {
    id: 10,
    title: "Full Stack Project 2 (Mongoose + SSLCommerz + AI)",
    subtitle: "Design a high-fidelity commercial MVC system integrating SSLCommerz gateway and local Ollama inference.",
    duration: "3 Weeks",
    modules: [
      "Mongoose Schema definitions, Middlewares & virtual fields",
      "SSLCommerz v4 integration guides & sandbox testing validation",
      "Ollama model loading & offline local LLM prompt evaluations",
      "Clean Architectural Model-View-Controller (MVC) server organization",
      "Structured error boundaries & database transaction validation"
    ],
    resources: [
      { title: "Mongoose Full Course", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA", creator: "The Net Ninja (YouTube Playlist)", type: "video" },
      { title: "Mongoose Crash Course", url: "https://www.youtube.com/watch?v=DZBGEVgL2eE", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "Official Mongoose Docs", url: "https://mongoosejs.com/docs/", creator: "Mongoose Core Team", type: "doc" },
      { title: "ShadCN UI Tutorial", url: "https://www.youtube.com/watch?v=7MKEOfSP2s4", creator: "Hamed Bahram (YouTube)", type: "video" },
      { title: "Official ShadCN Docs", url: "https://ui.shadcn.com/docs", creator: "ShadCN Team", type: "doc" },
      { title: "SSLCommerz Integration Guide", url: "https://developer.sslcommerz.com/doc/v4/", creator: "SSLCommerz Dev Center", type: "doc" },
      { title: "SSLCommerz Sandbox Tutorial", url: "https://www.youtube.com/results?search_query=sslcommerz+integration+node+express", creator: "SSLCommerz Sandbox (YouTube)", type: "video" },
      { title: "Ollama Official Docs", url: "https://ollama.com/library", creator: "Ollama Team", type: "doc" },
      { title: "Run Local LLMs with Ollama", url: "https://www.youtube.com/watch?v=GyllRd2E6fg", creator: "Fireship (YouTube)", type: "video" },
      { title: "MVC Pattern with Node & Express", url: "https://www.youtube.com/watch?v=Cgvopu9zg8Y", creator: "The Net Ninja (YouTube)", type: "video" },
      { title: "Clean Architecture in Node.js", url: "https://www.youtube.com/watch?v=eLJTrKSMNzE", creator: "Codevolution (YouTube)", type: "video" }
    ]
  },
  {
    id: 11,
    title: "AI-Assisted Coding",
    subtitle: "Accelerate feature shipping speeds using Cursor, Claude Code CLI, v0 components, and CI/CD audit systems.",
    duration: "2 Weeks",
    modules: [
      "Cursor agent rules & context manipulation commands",
      "Claude Code terminal command-line operations",
      "v0 declarative code generator blocks & Tailwind mappings",
      "Bolt.new & Lovable rapid browser deployment systems",
      "Figma design-to-code compiler platforms & CI code reviews"
    ],
    resources: [
      { title: "Cursor AI Full Tutorial", url: "https://www.youtube.com/watch?v=gqUQbjsYZLQ", creator: "Fireship (YouTube)", type: "video" },
      { title: "Cursor AI for Beginners", url: "https://www.youtube.com/watch?v=ocMOZpuAMw4", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "Cursor Official Docs", url: "https://docs.cursor.com", creator: "Cursor Team", type: "doc" },
      { title: "Claude Code Official Docs", url: "https://docs.anthropic.com/en/docs/claude-code", creator: "Anthropic Team", type: "doc" },
      { title: "Claude Code Tutorial", url: "https://www.youtube.com/results?search_query=claude+code+cli+tutorial", creator: "Claude Code CLI (YouTube)", type: "video" },
      { title: "v0 Official Site", url: "https://v0.dev", creator: "Vercel v0", type: "doc" },
      { title: "v0 Tutorial", url: "https://www.youtube.com/watch?v=p7JXXX2fdsQ", creator: "Fireship (YouTube)", type: "video" },
      { title: "Bolt.new Tutorial", url: "https://www.youtube.com/watch?v=2h0UDs3vFaE", creator: "Traversy Media (YouTube)", type: "video" },
      { title: "Lovable Official Docs", url: "https://docs.lovable.dev", creator: "Lovable Team", type: "doc" },
      { title: "Figma for Beginners", url: "https://www.youtube.com/watch?v=FTFaQWZBqQ8", creator: "freeCodeCamp (YouTube)", type: "video" },
      { title: "Figma MCP — Official Docs", url: "https://help.figma.com/hc/en-us/articles/26939047173655", creator: "Figma Guides", type: "doc" },
      { title: "JavaScript Unit Testing", url: "https://www.youtube.com/watch?v=72_5_YuDCNA", creator: "Web Dev Simplified (YouTube)", type: "video" },
      { title: "CodeRabbit AI Code Review", url: "https://coderabbit.ai", creator: "CodeRabbit AI Team", type: "doc" },
      { title: "GitHub Copilot Getting Started", url: "https://docs.github.com/en/copilot/quickstart", creator: "GitHub Copilot Guides", type: "doc" }
    ]
  }
];

export const GENERAL_RESOURCES = [
  { title: "freeCodeCamp Curriculum", url: "https://www.freecodecamp.org/learn", creator: "freeCodeCamp", description: "HTML, CSS, JavaScript, React, and Backend Certifications." },
  { title: "The Odin Project", url: "https://www.theodinproject.com", creator: "The Odin Project", description: "A highly acclaimed, open-source full-stack curriculum." },
  { title: "javascript.info", url: "https://javascript.info", creator: "Ilya Kantor", description: "The premier handbook detailing JS mechanics from fundamentals to advanced tasks." },
  { title: "MDN Web Docs", url: "https://developer.mozilla.org", creator: "Mozilla Team", description: "The standard definitive reference library for all core web platform APIs." },
  { title: "CS50 Web Programming — Harvard", url: "https://www.youtube.com/playlist?list=PLhQjrBD2T382hIW-IsOVuXP1uMzEvmcE5", creator: "Harvard University", description: "Rigorous computer science perspective on web application architectures." },
  { title: "Roadmap.sh", url: "https://roadmap.sh", creator: "Roadmap.sh", description: "Highly interactive conceptual roadmap guides mapping out modern tech paths." }
];

export const ECOSYSTEM_STACK: EcosystemTech[] = [
  // Frontend Core
  {
    name: "HTML5 & CSS3",
    category: "Frontend Core",
    milestone: "Milestone 1",
    description: "Semantic layouts, canvas wrappers, box models, Flexbox and Grid calculations.",
    color: "orange",
    glowColor: "rgba(244,91,105,0.25)",
    iconName: "Code"
  },
  {
    name: "JavaScript ES6+",
    category: "Frontend Core",
    milestone: "Milestone 2 & 3",
    description: "Functional structures, async execution loops, closures, scope blocks, and high-order methods.",
    color: "yellow",
    glowColor: "rgba(234,179,8,0.25)",
    iconName: "FileJson"
  },
  {
    name: "TypeScript",
    category: "Frontend Core",
    milestone: "Milestone 4",
    description: "Static compiler safety, interfaces, generic utility structures, and object encapsulation.",
    color: "blue",
    glowColor: "rgba(59,130,246,0.25)",
    iconName: "Shield"
  },
  {
    name: "React 19",
    category: "Frontend Core",
    milestone: "Milestone 5",
    description: "Declarative component graphs, state-hooks, virtual DOM painting, and lightweight UI logic.",
    color: "cyan",
    glowColor: "rgba(6,182,212,0.25)",
    iconName: "Atom"
  },
  {
    name: "Tailwind CSS & DaisyUI",
    category: "Frontend Core",
    milestone: "Milestone 5",
    description: "Atomic class utilities, responsive layouts, modular styles, and rapid components.",
    color: "teal",
    glowColor: "rgba(20,184,166,0.25)",
    iconName: "Sparkles"
  },
  {
    name: "Next.js App Router",
    category: "Frontend Core",
    milestone: "Milestone 6",
    description: "RSC data pipelines, Server Actions, hybrid SEO models, and edge network routing.",
    color: "rose",
    glowColor: "rgba(244,63,94,0.25)",
    iconName: "Navigation"
  },

  // Backend & Database
  {
    name: "Node.js Server",
    category: "Backend & Database",
    milestone: "Milestone 8",
    description: "Event-driven, asynchronous Javascript runtime environments built on Chrome's V8 compiler.",
    color: "emerald",
    glowColor: "rgba(16,185,129,0.25)",
    iconName: "Server"
  },
  {
    name: "Express.js Engine",
    category: "Backend & Database",
    milestone: "Milestone 8",
    description: "Minimalist server framework handling server request middleware and route matching rules.",
    color: "zinc",
    glowColor: "rgba(161,161,170,0.25)",
    iconName: "Layers"
  },
  {
    name: "MongoDB Atlas",
    category: "Backend & Database",
    milestone: "Milestone 8",
    description: "Fully cloud-hosted document-store database constructed for scalable JSON records.",
    color: "emerald",
    glowColor: "rgba(52,211,153,0.25)",
    iconName: "Database"
  },
  {
    name: "Mongoose ODM",
    category: "Backend & Database",
    milestone: "Milestone 10",
    description: "Schema-based database validation maps, virtual fields, hook systems, and middleware pipelines.",
    color: "orange",
    glowColor: "rgba(249,115,22,0.25)",
    iconName: "Link"
  },

  // E-Commerce & Advanced
  {
    name: "Stripe API",
    category: "E-Commerce & Advanced",
    milestone: "Milestone 9",
    description: "Global credit processing, secure server webhooks, and hosted subscription products.",
    color: "indigo",
    glowColor: "rgba(99,102,241,0.25)",
    iconName: "CreditCard"
  },
  {
    name: "SSLCommerz Sandbox",
    category: "E-Commerce & Advanced",
    milestone: "Milestone 10",
    description: "Bangladeshi local multi-channel transaction flow checking, validation and redirects.",
    color: "rose",
    glowColor: "rgba(225,29,72,0.25)",
    iconName: "ShieldCheck"
  },
  {
    name: "Auth Core (JWT / OAuth)",
    category: "E-Commerce & Advanced",
    milestone: "Milestone 7",
    description: "Token-based secure authentication protocols, session guards, and social logins.",
    color: "purple",
    glowColor: "rgba(168,85,247,0.25)",
    iconName: "Key"
  },

  // AI & Modern Dev Tools
  {
    name: "Ollama (Local LLMs)",
    category: "AI & Modern Dev Tools",
    milestone: "Milestone 10",
    description: "Offline localized language models inference processing directly on personal machines.",
    color: "blue",
    glowColor: "rgba(30,144,255,0.25)",
    iconName: "Cpu"
  },
  {
    name: "Cursor AI",
    category: "AI & Modern Dev Tools",
    milestone: "Milestone 11",
    description: "AI-native IDE wrapper with smart code transformations, agent debugging, and inline edits.",
    color: "cyan",
    glowColor: "rgba(34,211,238,0.25)",
    iconName: "CpuCore"
  },
  {
    name: "Claude Code CLI",
    category: "AI & Modern Dev Tools",
    milestone: "Milestone 11",
    description: "Terminal-based AI engineering agent executing terminal actions, editing, and audits.",
    color: "orange",
    glowColor: "rgba(255,127,80,0.25)",
    iconName: "Terminal"
  },
  {
    name: "v0 & Bolt.new",
    category: "AI & Modern Dev Tools",
    milestone: "Milestone 11",
    description: "Rapid visual prototyping platforms generating styled layout grids and hosting apps.",
    color: "zinc",
    glowColor: "rgba(244,244,245,0.25)",
    iconName: "Zap"
  }
];

export const CAPSTONE_PROJECTS: CapstoneProject[] = [
  {
    title: "Static Corporate Web Frame & Git Flow",
    milestone: "Milestone 1",
    milestoneNum: 1,
    description: "A production-ready business landing page strictly styled with semantic markup and custom CSS layouts.",
    technologies: ["HTML5", "CSS3", "Flexbox", "Grid", "Git", "GitHub Pull Requests"],
    challenge: "Executing perfect layout alignments on diverse displays and configuring complex merge conflict resolutions via GitHub.",
    difficulty: "Beginner",
    folderStructure: "├── index.html\n├── styles/\n│   ├── main.css\n│   ├── layout.css\n│   └── variables.css\n├── assets/\n└── README.md",
    architectureFlow: "Git branching -> Feature creation -> Remote repository sync -> Pull Request -> Peer review audits -> Final Main branch merges."
  },
  {
    title: "Interactive Dynamic Dashboard",
    milestone: "Milestone 2 & 3",
    milestoneNum: 2,
    description: "A high-performance client-side application utilizing async APIs, JS Closures, and high-order operations.",
    technologies: ["Vanilla JavaScript", "ES6+", "Fetch API", "DOM API", "JSON Data structures"],
    challenge: "Handling network racing conditions during deep API crawls and preventing lexical memory leaks within Closures.",
    difficulty: "Intermediate",
    folderStructure: "├── index.html\n├── js/\n│   ├── api.js       # Asynchronous fetch blocks\n│   ├── state.js     # Lexical closure state\n│   └── render.js    # Direct DOM tree updates\n└── assets/",
    architectureFlow: "Browser Event -> State update in closure -> Async API fetch validation -> Direct DOM node manipulation rendering."
  },
  {
    title: "TypeScript Native Task Matrix",
    milestone: "Milestone 4",
    milestoneNum: 4,
    description: "A strongly-typed command board featuring reusable Generics and OOP design classes.",
    technologies: ["TypeScript", "Generics", "OOP Classes", "Local Storage API"],
    challenge: "Implementing polymorphic data matrices that compile cleanly without fallback 'any' declarations.",
    difficulty: "Intermediate",
    folderStructure: "├── src/\n│   ├── types/\n│   │   └── board.ts  # Generic templates\n│   ├── models/\n│   │   └── Task.ts   # OOP Class interfaces\n│   ├── index.ts      # App Entry\n│   └── storage.ts    # Secure state serialization\n└── tsconfig.json",
    architectureFlow: "Input -> Static Type checking -> OOP Model instantiation -> Type guarded local database serialization."
  },
  {
    title: "Multi-Tenant Analytics Console",
    milestone: "Milestone 5",
    milestoneNum: 5,
    description: "An immersive client application rendering beautiful responsive layout modules and custom state hooks.",
    technologies: ["React 19", "Custom Hooks", "Tailwind CSS", "DaisyUI", "Recharts"],
    challenge: "Securing infinite rendering loops inside useEffect hooks and keeping data matrices synchronized across disparate layout grids.",
    difficulty: "Advanced",
    folderStructure: "├── src/\n│   ├── components/   # Modular card views\n│   ├── hooks/\n│   │   └── useMetrics.ts # Custom memo data\n│   ├── App.tsx\n│   └── index.css     # Tailwind imports\n└── package.json",
    architectureFlow: "Trigger state hook -> React Virtual DOM render -> Optimized layout redraws with cached mathematical charts."
  },
  {
    title: "Hybrid SSR/ISR E-Commerce Engine",
    milestone: "Milestone 6",
    milestoneNum: 6,
    description: "An optimized commercial portal built around Server Component architectures and static rendering schemes.",
    technologies: ["Next.js App Router", "React Server Components", "Incremental Static Regeneration (ISR)", "Static Site Gen (SSG)"],
    challenge: "Synchronizing localized client states with static edge server assets while preserving optimal cumulative layout shifts.",
    difficulty: "Advanced",
    folderStructure: "├── app/\n│   ├── layout.tsx\n│   ├── page.tsx          # ISR Homepage\n│   ├── products/\n│   │   └── [id]/\n│   │       └── page.tsx  # Dynamic SSG page\n│   └── api/\n└── next.config.js",
    architectureFlow: "Incoming request -> Edge Routing checks -> Load Server Component pre-built static HTML -> Client hydration modules."
  },
  {
    title: "Role-Based Secure Portal",
    milestone: "Milestone 7",
    milestoneNum: 7,
    description: "An authorization framework securing application routes with session validation structures and provider loops.",
    technologies: ["NextAuth.js", "BetterAuth", "JWT Token Signing", "Secure HttpOnly Cookies"],
    challenge: "Configuring robust refresh token validation loops and safeguarding middleware endpoints from unauthorized bypasses.",
    difficulty: "Advanced",
    folderStructure: "├── app/\n│   ├── api/\n│   │   └── auth/\n│   │       └── [...nextauth]/ # Auth handlers\n│   ├── middleware.ts     # Global route shield\n│   └── profile/\n└── .env",
    architectureFlow: "Social/Email Login -> Provider handshake -> Generate secure encrypted HttpOnly JWT cookie -> Middleware validation checks."
  },
  {
    title: "Distributed CRUD Core & MongoDB",
    milestone: "Milestone 8",
    milestoneNum: 8,
    description: "A highly resilient RESTful server managing complex collection models and request routers.",
    technologies: ["Node.js", "Express.js", "MongoDB Atlas", "REST compliance APIs", "Logger Middleware"],
    challenge: "Handling concurrent server pooling limitations and optimizing complex database index pathways.",
    difficulty: "Advanced",
    folderStructure: "├── src/\n│   ├── config/\n│   │   └── db.js         # Pool configurations\n│   ├── routes/           # Request routes map\n│   ├── controllers/      # Database handlers\n│   ├── middlewares/      # Error filters\n│   └── server.js\n└── package.json",
    architectureFlow: "REST request -> Express Router matches -> Controller triggers aggregation query -> Document db pool responses."
  },
  {
    title: "Automated E-Commerce Billing with Stripe",
    milestone: "Milestone 9",
    milestoneNum: 9,
    description: "A checkout pipeline executing instant credit transactions, signature webhook validations, and tier checks.",
    technologies: ["Stripe Core SDK", "Express Middlewares", "RBAC Route Protection", "Webhook Signatures"],
    challenge: "Preventing transactional bypasses on asynchronous webhooks and ensuring idempotent checkout handling.",
    difficulty: "Expert",
    folderStructure: "├── src/\n│   ├── routes/\n│   │   └── checkout.js\n│   ├── webhooks/\n│   │   └── stripe.js     # Raw buffer hook\n│   ├── middleware/\n│   │   └── authorize.js  # RBAC filter\n│   └── server.js",
    architectureFlow: "Checkout session -> Direct Stripe payment -> Asynchronous Webhook payload -> Verify signature -> Grant account subscription tier."
  },
  {
    title: "AI-Driven Multi-Vendor Nexus",
    milestone: "Milestone 10",
    milestoneNum: 10,
    description: "An advanced commercial marketplace applying MVC patterns, SSLCommerz gateway validations, and Ollama local models.",
    technologies: ["Mongoose ODM", "SSLCommerz v4 SDK", "Local Ollama LLM API", "MVC Server", "ShadCN UI"],
    challenge: "Constructing verified double-entry transaction audits and processing thread-safe localized AI pipeline calls.",
    difficulty: "Expert",
    folderStructure: "├── src/\n│   ├── models/\n│   │   └── Transaction.js\n│   ├── controllers/\n│   │   ├── paymentController.js\n│   │   └── aiController.js\n│   ├── services/\n│   │   └── ollama.js     # Prompt parser\n│   └── app.js",
    architectureFlow: "Order checkout -> Trigger SSLCommerz sandbox payment -> Verify gateway hash -> Pass purchase analytics through local Ollama LLM."
  },
  {
    title: "AI-Augmented Microservice Framework",
    milestone: "Milestone 11",
    milestoneNum: 11,
    description: "A continuous integration framework built and tested through automated AI-agents and mock compilers.",
    technologies: ["Cursor Agent Rules", "Claude Code CLI", "v0 Visual Component Compiler", "Jest Unit testing", "CodeRabbit AI Audit"],
    challenge: "Maintaining complete mock coverage across asynchronous pipelines and structuring system prompt alignment files.",
    difficulty: "Expert",
    folderStructure: "├── .cursorrules\n├── tests/\n│   ├── unit/\n│   └── integration/\n├── .github/\n│   └── workflows/        # Automated audits\n├── package.json\n└── README.md",
    architectureFlow: "Claude Code CLI refactoring -> Automated local Jest test -> Commit code -> CodeRabbit AI inspects PR -> Cloud deployment."
  }
];
