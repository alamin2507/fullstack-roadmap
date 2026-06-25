'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── COURSE DATA ─────────────────────────────────────────────────────────────
const MILESTONES = [
  {
    id: 'm0', phase: 0, title: 'Orientation & AI Mindset',
    color: '#06b6d4', glow: 'rgba(6,182,212,0.35)', icon: '🧭',
    modules: [
      {
        id: 'mod-0', num: '0', title: 'Welcome & Tool Setup', time: '~3 days',
        topics: [
          'Time management & building a self-study routine',
          'Install VS Code, Node.js, Git, GitHub',
          'VS Code extensions: Prettier, Live Server, ESLint',
          'Understanding the full learning roadmap',
        ],
        resources: [
          { label: 'VS Code Download', url: 'https://code.visualstudio.com/', type: 'tool' },
          { label: 'Node.js Download', url: 'https://nodejs.org/en/download', type: 'tool' },
          { label: 'Git Download', url: 'https://git-scm.com/downloads', type: 'tool' },
          { label: 'VS Code Setup for Web Dev — Traversy Media', url: 'https://www.youtube.com/watch?v=fJEbVCrEMSE', type: 'youtube' },
        ],
        project: { title: 'Dev Environment Setup', desc: 'Install all tools, create a GitHub account, push your first file.' },
      },
      {
        id: 'mod-05', num: '0.5', title: 'AI Reality, Risks & Mindset', time: '~4 days',
        topics: [
          'Why AI is advancing rapidly — capabilities & limitations',
          'Can AI replace developers? Engineer vs Developer mindset',
          'Common mistakes when using AI as a learner',
          'AI Native Workflow — AI as a daily companion',
          'Prompt engineering basics & how LLMs think',
        ],
        resources: [
          { label: 'Prompt Engineering Guide — DAIR.AI', url: 'https://www.promptingguide.ai/', type: 'docs' },
          { label: 'Learn Prompting — Free Open Course', url: 'https://learnprompting.org/', type: 'site' },
          { label: 'How AI Works — CGP Grey', url: 'https://www.youtube.com/watch?v=X-AWdfSFCHQ', type: 'youtube' },
          { label: 'Neural Networks — 3Blue1Brown', url: 'https://www.youtube.com/watch?v=aircAruvnKk', type: 'youtube' },
        ],
        project: null,
      },
    ],
  },
  {
    id: 'm1', phase: 1, title: 'Web Foundation — HTML, CSS & GitHub',
    color: '#38bdf8', glow: 'rgba(56,189,248,0.35)', icon: '🌐',
    modules: [
      {
        id: 'mod-1', num: '1', title: 'Frontend Basics: HTML & CSS', time: '~1 week',
        topics: [
          'HTML page structure, first HTML file in VS Code',
          'Headings, paragraphs, formatting, lists, links, images, buttons',
          'HTML Forms: input types, select, option',
          'CSS: inline, internal, external stylesheets',
          'CSS Selectors: tag, class, id, universal, combined',
          'CSS Box Model: margin, padding, border, width, height',
          'CSS Styling: fonts, backgrounds, display, visibility, box-shadow',
        ],
        resources: [
          { label: 'MDN — Learn HTML', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', type: 'docs' },
          { label: 'MDN — Learn CSS', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS', type: 'docs' },
          { label: 'HTML Full Course — freeCodeCamp', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', type: 'youtube' },
          { label: 'CSS Crash Course — Traversy Media', url: 'https://www.youtube.com/watch?v=yfoY53QXEnI', type: 'youtube' },
          { label: 'freeCodeCamp — Responsive Web Design Cert', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'site' },
          { label: 'The Odin Project — Foundations', url: 'https://www.theodinproject.com/paths/foundations', type: 'site' },
        ],
        project: { title: 'Personal Info Page', desc: 'Build a styled HTML page with headings, photo, hobbies list, and contact form.' },
      },
      {
        id: 'mod-2', num: '2', title: 'Version Control with Git & GitHub', time: '~5 days',
        topics: [
          'What is version control? Git vs GitHub',
          'Create a GitHub repo, explore the interface',
          'git init, git add, git commit basics',
          'git push — sending changes to GitHub',
          'Common beginner issues and fixes',
          '[Advanced] git branch, pull requests, merge',
        ],
        resources: [
          { label: 'Git & GitHub for Beginners — freeCodeCamp', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', type: 'youtube' },
          { label: 'Learn Git Branching — Interactive Game', url: 'https://learngitbranching.js.org/', type: 'site' },
          { label: 'GitHub Quickstart Docs', url: 'https://docs.github.com/en/get-started/quickstart', type: 'docs' },
        ],
        project: { title: 'Git Workflow Practice', desc: 'Make 5 meaningful commits on a project, practice branching and merging.' },
      },
      {
        id: 'mod-3', num: '3', title: 'Semantic HTML & Advanced Elements', time: '~1 week',
        topics: [
          'HTML5: nav, main, header, footer, section, article',
          'Audio, video, YouTube embed, iframes',
          'HTML Forms: label, fieldset, legend, radio, checkbox, textarea',
          'HTML Tables: tr, th, td, colspan, thead, tbody, tfoot',
          'CSS Flexbox overview, box model recap',
          'Navbar, hero section, card components with Flexbox',
        ],
        resources: [
          { label: 'MDN — HTML Elements Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', type: 'docs' },
          { label: 'HTML5 Semantic Elements — Kevin Powell', url: 'https://www.youtube.com/watch?v=kGW8Al_cga4', type: 'youtube' },
          { label: 'Flexbox in 15 minutes — Kevin Powell', url: 'https://www.youtube.com/watch?v=phWxA89Dy94', type: 'youtube' },
          { label: 'Flexbox Froggy — Gamified Learning', url: 'https://flexboxfroggy.com/', type: 'site' },
        ],
        project: null,
      },
      {
        id: 'mod-4', num: '4', title: 'CSS Layouts & Advanced Styling', time: '~1.5 weeks',
        topics: [
          'CSS Units: px, %, em, rem, auto',
          'Flexbox: direction, justify-content, align-items',
          'CSS Grid: columns, gaps, calendar layout',
          'Pseudo-classes: :hover, :focus, :visited',
          'Pseudo-elements: ::before, ::after, :nth-child',
          'CSS Positioning: static, relative, absolute, fixed, sticky, z-index',
        ],
        resources: [
          { label: 'CSS Grid Crash Course — Traversy Media', url: 'https://www.youtube.com/watch?v=jV8B24rSN5o', type: 'youtube' },
          { label: 'Grid Garden — Gamified CSS Grid', url: 'https://cssgridgarden.com/', type: 'site' },
          { label: 'CSS Tricks — Complete Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'docs' },
          { label: 'CSS Tricks — Complete Grid Guide', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', type: 'docs' },
        ],
        project: null,
      },
      {
        id: 'mod-5', num: '5', title: 'Build a Portfolio Website', time: '~1 week',
        topics: [
          'Project planning: git setup, Google Fonts integration',
          'Navbar with primary colors and branding',
          'Hero banner with portfolio image using Flexbox',
          'About, skills, resume sections',
          'Styled contact form',
          'Deploy to GitHub Pages (free hosting)',
          'Font Awesome icons integration',
        ],
        resources: [
          { label: 'Build a Portfolio Website — Traversy Media', url: 'https://www.youtube.com/watch?v=oYRda7UtuhA', type: 'youtube' },
          { label: 'Google Fonts — Free Web Fonts', url: 'https://fonts.google.com/', type: 'tool' },
          { label: 'Font Awesome — Free CDN Icons', url: 'https://fontawesome.com/start', type: 'tool' },
          { label: 'GitHub Pages — Free Hosting', url: 'https://pages.github.com/', type: 'tool' },
        ],
        project: { title: 'Personal Portfolio Website', desc: 'Full responsive portfolio with navbar, hero, about, skills, resume, contact form. Deploy live on GitHub Pages.' },
      },
    ],
  },
  {
    id: 'm2', phase: 2, title: 'JavaScript Foundations',
    color: '#f59e0b', glow: 'rgba(245,158,11,0.35)', icon: '⚡',
    modules: [
      {
        id: 'mod-7', num: '7', title: 'Introduction to JavaScript', time: '~1 week',
        topics: [
          'What is JavaScript? Running JS in VS Code & browser console',
          'Variables: var, let, const — 5 things to declare a variable',
          'Data types: Number, String, Boolean',
          'JS keywords, naming conventions (camelCase)',
          'Arithmetic operators and Math object',
          'Shorthand operators: +=, -=, *=',
        ],
        resources: [
          { label: 'javascript.info — The Modern JS Tutorial', url: 'https://javascript.info/', type: 'docs' },
          { label: 'JavaScript Crash Course — Traversy Media', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', type: 'youtube' },
          { label: 'freeCodeCamp — JS Algorithms & Data Structures', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', type: 'site' },
        ],
        project: null,
      },
      {
        id: 'mod-8', num: '8', title: 'Conditionals', time: '~5 days',
        topics: [
          'Comparison operators: ==, !=, >, <, >=, <=',
          'if, else if, else statements',
          'Logical operators: && (AND), || (OR)',
          'Multi-level if-else chains, nested if-else',
          'Ternary operator shorthand',
          'Logical NOT operator (!)',
        ],
        resources: [
          { label: 'javascript.info — Conditional Branching', url: 'https://javascript.info/ifelse', type: 'docs' },
          { label: 'JavaScript Conditionals — Mosh', url: 'https://www.youtube.com/watch?v=IsG4Xd6LlsM', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-9-11', num: '9-11', title: 'Arrays & Loops', time: '~2 weeks',
        topics: [
          'Arrays: length, index, get/set by index',
          'push, pop, shift, unshift — adding/removing elements',
          'for loop, while loop, do-while loop',
          'break and continue statements',
          'Array traversal, reversing, sorting',
          'isArray and basic array methods',
        ],
        resources: [
          { label: 'javascript.info — Arrays', url: 'https://javascript.info/array', type: 'docs' },
          { label: 'javascript.info — Loops', url: 'https://javascript.info/while-for', type: 'docs' },
          { label: 'JavaScript Arrays — Traversy Media', url: 'https://www.youtube.com/watch?v=0SyTDl4pb4w', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-12', num: '12', title: 'Strings & Objects', time: '~1 week',
        topics: [
          'Strings vs arrays — similarities and differences',
          'toLowerCase, toUpperCase, trim, slice, includes, concat',
          'Reverse a string (3 approaches)',
          'Objects: properties and values',
          'Dot notation vs bracket notation',
          'Keys, values, nested objects, delete operator',
          'Looping objects: for...in, Object.keys(), Object.values()',
        ],
        resources: [
          { label: 'javascript.info — Strings', url: 'https://javascript.info/string', type: 'docs' },
          { label: 'javascript.info — Objects', url: 'https://javascript.info/object', type: 'docs' },
        ],
        project: null,
      },
      {
        id: 'mod-13-15', num: '13-15', title: 'Functions & Problem Solving', time: '~1.5 weeks',
        topics: [
          'Function syntax: declaration vs expression',
          'Parameters, arguments, multiple parameters',
          'Return values, conditional return',
          'Default and rest parameters',
          'Basic algorithm problem solving',
        ],
        resources: [
          { label: 'javascript.info — Functions', url: 'https://javascript.info/function-basics', type: 'docs' },
          { label: 'Codewars — JS Problem Solving (Free)', url: 'https://www.codewars.com/', type: 'site' },
          { label: 'Edabit — JavaScript Challenges', url: 'https://edabit.com/challenges/javascript', type: 'site' },
        ],
        project: { title: '10 JS Algorithm Challenges', desc: 'Solve 10 challenges on Codewars (8kyu-7kyu). Push all solutions to GitHub with comments.' },
      },
    ],
  },
  {
    id: 'm3', phase: 3, title: 'Empowering JS with ES6+',
    color: '#a78bfa', glow: 'rgba(167,139,250,0.35)', icon: '✨',
    modules: [
      {
        id: 'mod-16', num: '16', title: 'ES6 Fundamentals', time: '~1 week',
        topics: [
          'var vs let vs const — scope and hoisting differences',
          'Default function parameters',
          'Template literals — multiline and dynamic strings',
          'Arrow functions: syntax, params, implicit return',
          'Spread operator — array copy, merge, Math.max',
          'Destructuring: array and object',
          'Object methods: keys, values, entries, seal, freeze',
          'Nested objects, optional chaining (?.), nullish coalescing (??)',
        ],
        resources: [
          { label: 'ES6 Tutorial — Programming with Mosh', url: 'https://www.youtube.com/watch?v=nZ1DMMsyVyI', type: 'youtube' },
          { label: 'javascript.info — Arrow Functions', url: 'https://javascript.info/arrow-functions-basics', type: 'docs' },
          { label: 'javascript.info — Destructuring', url: 'https://javascript.info/destructuring-assignment', type: 'docs' },
          { label: 'ES6+ Features — freeCodeCamp', url: 'https://www.youtube.com/watch?v=WZQc7RUAg18', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-17-20', num: '17-20', title: 'Advanced ES6 — Closures, Array Methods & Problem Solving', time: '~2.5 weeks',
        topics: [
          'null vs undefined, truthy and falsy values',
          '== vs === implicit type conversion',
          'Block scope, global scope, hoisting in detail',
          'Closure — what it is and practical use',
          'Callback functions and passing functions',
          'Pass by reference vs pass by value',
          'Array power methods: map, forEach, filter, find',
          'Array methods: slice, reduce',
          'ES6 Problem Solving (2 intensive sets)',
        ],
        resources: [
          { label: 'javascript.info — Closures', url: 'https://javascript.info/closure', type: 'docs' },
          { label: 'map, filter, reduce — Fun Fun Function', url: 'https://www.youtube.com/watch?v=BMUiFMZr7vk', type: 'youtube' },
          { label: 'javascript.info — Array Methods', url: 'https://javascript.info/array-methods', type: 'docs' },
        ],
        project: { title: 'ES6 Problem Solving Set', desc: 'Solve 15 problems using exclusively ES6+ features: arrow functions, destructuring, map/filter/reduce. Push to GitHub.' },
      },
    ],
  },
  {
    id: 'm4', phase: 4, title: 'TypeScript — Life Saver of JS',
    color: '#34d399', glow: 'rgba(52,211,153,0.35)', icon: '🔷',
    modules: [
      {
        id: 'mod-21', num: '21', title: 'TypeScript Fundamentals', time: '~1.5 weeks',
        topics: [
          'What is TypeScript? Why use it?',
          'Setting up and running TypeScript (tsc, ts-node)',
          'Primitive types: string, number, boolean',
          'Arrays, tuples, object types, optional properties',
          'Typing function inputs and outputs',
          'Rest, spread, destructuring in TypeScript',
          'Special types: null, undefined, unknown, never, any',
        ],
        resources: [
          { label: 'TypeScript Official Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'docs' },
          { label: 'TypeScript Tutorial — Mosh (3hr)', url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs', type: 'youtube' },
          { label: 'Total TypeScript — Free Tutorials', url: 'https://www.totaltypescript.com/tutorials', type: 'site' },
          { label: 'TypeScript Playground', url: 'https://www.typescriptlang.org/play', type: 'tool' },
        ],
        project: null,
      },
      {
        id: 'mod-22', num: '22-22.5', title: 'Advanced TypeScript & OOP', time: '~1.5 weeks',
        topics: [
          'Type assertions and type casting',
          'Interfaces for structured type definitions',
          'Generics for reusable and scalable types',
          'Enums and as const for immutable patterns',
          'Utility types: Partial, Required, Readonly, Pick, Omit',
          'OOP: Classes, constructors, methods',
          'Inheritance (extends), access modifiers',
          'Getters, setters, static members',
          'Polymorphism, abstraction, encapsulation',
        ],
        resources: [
          { label: 'TypeScript Handbook — Generics', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html', type: 'docs' },
          { label: 'TypeScript Handbook — Classes', url: 'https://www.typescriptlang.org/docs/handbook/2/classes.html', type: 'docs' },
          { label: 'OOP in TypeScript — Mosh', url: 'https://www.youtube.com/watch?v=fsVL_xrYO0w', type: 'youtube' },
        ],
        project: { title: 'TypeScript OOP Task Manager', desc: 'Build a Task class with inheritance, typed methods, interfaces, and generics. Pure TypeScript logic — no UI needed.' },
      },
    ],
  },
  {
    id: 'm5', phase: 5, title: 'Building Interactive UIs with React',
    color: '#60a5fa', glow: 'rgba(96,165,250,0.35)', icon: '⚛️',
    modules: [
      {
        id: 'mod-25', num: '25', title: 'React Core — Components, JSX, Props & Rendering', time: '~1 week',
        topics: [
          'What is React? React vs Next.js',
          'Functional components, building your first component',
          'JSX rules: single root, className, self-closing',
          'Dynamic content in JSX (curly braces)',
          'Props: passing and reading, read-only nature',
          'Conditional rendering: if, ternary, &&, ||',
          'Rendering lists with .map() and keys',
        ],
        resources: [
          { label: 'React Official Docs — Learn React', url: 'https://react.dev/learn', type: 'docs' },
          { label: 'React Crash Course 2024 — Traversy Media', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', type: 'youtube' },
          { label: 'Scrimba — Learn React for Free', url: 'https://scrimba.com/learn/learnreact', type: 'site' },
        ],
        project: null,
      },
      {
        id: 'mod-26', num: '26', title: 'State Management, Events & Data Fetching', time: '~1.5 weeks',
        topics: [
          'Vite project setup — folder structure and environment',
          'Event handling: onClick, onChange, onSubmit',
          'State in React — why state matters, re-rendering',
          'useState Hook: declaring, updating, reading',
          'Fetching data with async/await and fetch()',
          'useEffect Hook: side effects and dependencies',
          'Axios — professional data fetching library',
        ],
        resources: [
          { label: 'React Docs — useState', url: 'https://react.dev/reference/react/useState', type: 'docs' },
          { label: 'React Docs — useEffect', url: 'https://react.dev/reference/react/useEffect', type: 'docs' },
          { label: 'React Hooks Explained — Web Dev Simplified', url: 'https://www.youtube.com/watch?v=qJB9xKc1wjo', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-27', num: '27', title: 'React Project — Countries Explorer', time: '~1 week',
        topics: [
          'Countries REST API integration',
          'Display countries list with component layout',
          'Country card: flags, conditional text, error handling',
          'Tailwind CSS and DaisyUI setup',
          'Responsive 3-column grid layout',
          'State lifting between parent and child',
          'Immutable state updates (spread + filter)',
          'Data visualization with Recharts',
          'Deploy to Netlify / Vercel',
        ],
        resources: [
          { label: 'REST Countries API — Free', url: 'https://restcountries.com/', type: 'tool' },
          { label: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs', type: 'docs' },
          { label: 'DaisyUI — Free Tailwind Components', url: 'https://daisyui.com/', type: 'tool' },
          { label: 'Build a Countries App — Coding Addict', url: 'https://www.youtube.com/watch?v=EY_4KzSGxNE', type: 'youtube' },
        ],
        project: { title: 'Countries Explorer App', desc: 'React app: all 250 countries with flags, search, region filter, detail page, population chart. Deploy to Vercel.' },
      },
      {
        id: 'mod-28-29', num: '28-29', title: 'JavaScript DOM Deep Dive + React SPA', time: '~1.5 weeks',
        topics: [
          'DOM: Document Object Model and tree structure',
          'DOM selection: getElementById, querySelector',
          'DOM manipulation: text, attributes, styling',
          'Event handling: addEventListener, bubbling, delegation',
          'BOM: window, location, history API',
          'Timing: setTimeout, setInterval, clearTimeout',
          'Browser Storage: localStorage, sessionStorage',
          'Promises, fetch API, async/await in browser',
          'Virtual DOM and React diffing algorithm',
          'BPL Dream Project: player selection SPA',
        ],
        resources: [
          { label: 'javascript.info — DOM Chapter', url: 'https://javascript.info/document', type: 'docs' },
          { label: 'JavaScript DOM Crash Course — Traversy', url: 'https://www.youtube.com/watch?v=0ik6X4DJKCc', type: 'youtube' },
          { label: 'javascript.info — Promises & Async/Await', url: 'https://javascript.info/async', type: 'docs' },
        ],
        project: { title: 'Player Selection SPA', desc: 'React SPA: pick players for a team with budget validation, selected team panel, remove functionality. Deploy to Netlify.' },
      },
    ],
  },
  {
    id: 'm6', phase: 6, title: 'Next.js — Pages, Routing & Beyond',
    color: '#f87171', glow: 'rgba(248,113,113,0.35)', icon: '▲',
    modules: [
      {
        id: 'mod-31', num: '31', title: 'Next.js Foundation & Routing', time: '~1 week',
        topics: [
          'What is Next.js? Why choose it over plain React?',
          'Creating a Next.js app: project structure',
          'File-based routing, navigation with Link',
          'Dynamic routing and route segments ([id])',
          'Multiple layouts, Global CSS, Tailwind CSS',
          'Image optimization (next/image), Font optimization (next/font)',
          'Catch-all segments, not-found page, active links',
        ],
        resources: [
          { label: 'Next.js Official Learn Course', url: 'https://nextjs.org/learn', type: 'site' },
          { label: 'Next.js Official Docs', url: 'https://nextjs.org/docs', type: 'docs' },
          { label: 'Next.js 14 Full Course — Dave Gray', url: 'https://www.youtube.com/watch?v=ZjAqacIC_3c', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-32-33', num: '32-33', title: 'Rendering, Data Fetching & Caching', time: '~2 weeks',
        topics: [
          'CSR vs SSR vs SSG — what is rendering?',
          'Hydration, server vs client components',
          'Loading data in server and client components',
          'error.js and loading.js special files',
          "Caching: default cache and cache: 'no-store'",
          'ISR with revalidate — Incremental Static Regeneration',
          'generateStaticParams: optimizing dynamic routes',
          'Lazy loading with next/dynamic',
          'HeroUI / shadcn/ui integration',
        ],
        resources: [
          { label: 'Next.js Docs — Rendering', url: 'https://nextjs.org/docs/app/building-your-application/rendering', type: 'docs' },
          { label: 'Next.js Docs — Data Fetching', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching', type: 'docs' },
          { label: 'shadcn/ui — Free Component Library', url: 'https://ui.shadcn.com/', type: 'tool' },
          { label: 'Next.js App Router — Jack Herrington', url: 'https://www.youtube.com/watch?v=Sklc_fQBmcs', type: 'youtube' },
        ],
        project: { title: 'Next.js Product Showcase', desc: 'Multi-page Next.js app using a free API (TheMealDB). SSR list page, SSG detail pages, ISR revalidation. Deploy to Vercel.' },
      },
    ],
  },
  {
    id: 'm7', phase: 7, title: 'Authentication with Next.js',
    color: '#e879f9', glow: 'rgba(232,121,249,0.35)', icon: '🔐',
    modules: [
      {
        id: 'mod-35', num: '35', title: 'Auth with NextAuth.js (Auth.js v5)', time: '~1.5 weeks',
        topics: [
          'Authentication architecture overview',
          'Auth.js (NextAuth.js v5) setup & configuration',
          'MongoDB adapter setup',
          'Registration page & credentials sign-in',
          'Login page and session management',
          'Session data in server & client components',
          'Route protection with middleware',
          'Google OAuth & GitHub OAuth setup',
          'Logout system and deployment',
        ],
        resources: [
          { label: 'Auth.js (NextAuth v5) — Official Docs', url: 'https://authjs.dev/getting-started', type: 'docs' },
          { label: 'NextAuth.js Full Tutorial — Code with Antonio', url: 'https://www.youtube.com/watch?v=1MTyCvS05V4', type: 'youtube' },
          { label: 'MongoDB Atlas — Free Tier', url: 'https://www.mongodb.com/atlas', type: 'tool' },
        ],
        project: null,
      },
      {
        id: 'mod-36', num: '36', title: 'Auth Advanced — Profile, Password & Email', time: '~1.5 weeks',
        topics: [
          'Profile update form and saving changes',
          'Profile image upload to Cloudinary',
          'Change password: verify old, set new',
          'Forgot password: reset link, generate token, send email',
          'Reset password page: validate token, set new password',
          'Email verification on registration',
          'Resend verification email with expiry logic',
          'Global error handling and edge cases',
        ],
        resources: [
          { label: 'Nodemailer — Free Email Library', url: 'https://nodemailer.com/about/', type: 'docs' },
          { label: 'Cloudinary — Free Image Upload Tier', url: 'https://cloudinary.com/', type: 'tool' },
          { label: 'Resend — Free Email API (3k/month)', url: 'https://resend.com/', type: 'tool' },
        ],
        project: null,
      },
      {
        id: 'mod-37-38', num: '37-38', title: 'Next.js News/Blog Project with Full Auth', time: '~2 weeks',
        topics: [
          'Project setup: header, marquee, navbar design',
          'Grid layout, fetch categories, sidebar, filter by category',
          'News card components and loading states',
          'Auth integration: Server Actions for creating posts',
          'User-specific data (My Posts), delete with optimistic UI',
          'Comments system, loading skeletons, error handling',
          'Deploy to Vercel with environment variables',
        ],
        resources: [
          { label: 'Next.js Docs — Server Actions', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations', type: 'docs' },
          { label: 'Build a Blog with Next.js — freeCodeCamp', url: 'https://www.youtube.com/watch?v=O5iB-HXX_lM', type: 'youtube' },
        ],
        project: { title: 'News Platform with Full Auth', desc: 'Full news/blog: register/login, create/delete posts, comments, profile, Google & GitHub OAuth, email verification, password reset. Deploy to Vercel.' },
      },
    ],
  },
  {
    id: 'm8', phase: 8, title: 'Backend APIs & Database with MongoDB',
    color: '#2dd4bf', glow: 'rgba(45,212,191,0.35)', icon: '🗄️',
    modules: [
      {
        id: 'mod-40', num: '40', title: 'Node.js & Express — First API', time: '~1 week',
        topics: [
          'Client-server architecture',
          'How Node.js works (event loop, non-blocking I/O)',
          'Why Express.js? What it adds to Node',
          'SQL vs NoSQL — when to use MongoDB',
          'Environment setup: Node, Express, Nodemon',
          'First GET API: fetch and send data',
          'POST API: receive client data, CORS setup',
        ],
        resources: [
          { label: 'Node.js Official Guides', url: 'https://nodejs.org/en/docs/guides', type: 'docs' },
          { label: 'Express.js Guide — Routing', url: 'https://expressjs.com/en/guide/routing.html', type: 'docs' },
          { label: 'Node.js & Express.js Full Course — freeCodeCamp', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-41', num: '41', title: 'REST API & CRUD with MongoDB', time: '~1.5 weeks',
        topics: [
          'MongoDB Atlas account and cluster setup',
          'Async/Await and try-catch for DB connections',
          'Create: insertOne, POST endpoint',
          'Read: find, findOne',
          'Delete: deleteOne, ObjectId handling',
          'Update: PUT vs PATCH, updateOne',
          'Full CRUD flow end-to-end',
        ],
        resources: [
          { label: 'MongoDB Atlas Getting Started', url: 'https://www.mongodb.com/docs/atlas/getting-started/', type: 'docs' },
          { label: 'MongoDB Crash Course — Traversy', url: 'https://www.youtube.com/watch?v=vjf774RKrLc', type: 'youtube' },
          { label: 'MERN Stack Tutorial — Net Ninja', url: 'https://www.youtube.com/watch?v=fgTGADljAeg', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-42', num: '42', title: 'MongoDB Operators & Aggregation', time: '~1.5 weeks',
        topics: [
          'Comparison: $eq, $ne, $gt, $gte, $lt, $lte',
          'Logical: $and, $or, $not, $nor',
          'Array operators: $in, $nin, $all, $size, $elemMatch',
          'Update: $set, $inc, $push, $pull, $addToSet',
          'Projection, sort(), limit(), skip()',
          'Aggregation pipeline: $match, $group, $project',
          'Advanced: $lookup (joins), $unwind, $facet',
        ],
        resources: [
          { label: 'MongoDB Docs — Query Operators', url: 'https://www.mongodb.com/docs/manual/reference/operator/query/', type: 'docs' },
          { label: 'MongoDB Aggregation — freeCodeCamp', url: 'https://www.youtube.com/watch?v=Www6cTUymCY', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-43-45', num: '43-45', title: 'Booking Platform + JWT Security', time: '~2 weeks',
        topics: [
          'Project setup with shadcn/ui, Swiper.js carousel',
          'Full CRUD: Add/View/Edit/Delete destinations',
          'Booking system: create booking, My Bookings, cancel',
          'JWT: structure and token generation',
          'HTTPOnly cookies for token storage',
          'Protected API routes with JWT middleware',
          'User profile update, change password',
          'Backend deploy to Render, frontend to Vercel',
        ],
        resources: [
          { label: 'JWT.io — Introduction + Debugger', url: 'https://jwt.io/', type: 'tool' },
          { label: 'JWT Auth with Node.js — Web Dev Simplified', url: 'https://www.youtube.com/watch?v=7Q17ubqLfaM', type: 'youtube' },
          { label: 'Render — Free Backend Hosting', url: 'https://render.com/', type: 'tool' },
        ],
        project: { title: 'Travel Destination Booking Platform', desc: 'REST API with Node/Express, MongoDB, JWT auth, CRUD destinations, booking system, protected routes. Deploy both frontend and backend.' },
      },
    ],
  },
  {
    id: 'm9', phase: 9, title: 'Full Stack Project 1 — AI First',
    color: '#c084fc', glow: 'rgba(192,132,252,0.35)', icon: '🚀',
    modules: [
      {
        id: 'mod-47', num: '47', title: 'Requirement Analysis & PRD Planning', time: '~1 week',
        topics: [
          'What is a PRD (Product Requirements Document)?',
          'Requirement analysis: problem, users, goals',
          'User stories and feature lists with AI',
          'Prompt engineering for project planning',
          'Wireframing with v0.dev and Excalidraw',
          'Database entity relationship design',
          'Project roadmap and milestone planning',
        ],
        resources: [
          { label: 'v0.dev — AI UI Prototyping by Vercel', url: 'https://v0.dev/', type: 'tool' },
          { label: 'Excalidraw — Free Wireframing Tool', url: 'https://excalidraw.com/', type: 'tool' },
          { label: 'dbdiagram.io — Free DB Design Tool', url: 'https://dbdiagram.io/', type: 'tool' },
        ],
        project: null,
      },
      {
        id: 'mod-48-50', num: '48-50', title: 'Full Stack Setup, Implementation & Stripe Payments', time: '~3 weeks',
        topics: [
          'Next.js + Node + Express project initialization',
          'TypeScript across frontend and backend',
          'shadcn/ui integration and theme customization',
          'MongoDB Atlas connection, folder structure',
          'REST API routes: full CRUD endpoints',
          'JWT auth: login/register API',
          'Role-Based Access Control (RBAC): Admin, User, Moderator',
          'Protected frontend routes by role, dashboard pages',
          'Stripe: checkout session, success/cancel pages',
          'Stripe Webhooks: events, listener, signature verification',
          'Storing payment records in MongoDB',
        ],
        resources: [
          { label: 'Stripe Quickstart — Official Docs', url: 'https://stripe.com/docs/payments/quickstart', type: 'docs' },
          { label: 'Stripe Payments with Next.js — Lee Robinson', url: 'https://www.youtube.com/watch?v=lbEFSP1WAv0', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-51', num: '51', title: 'Review, UI/UX Polish & Deployment', time: '~1 week',
        topics: [
          'End-to-end feature checking and UI/UX review',
          'Bug fixing — systematic approach',
          'Code cleanup: removing unused code',
          'Performance optimization: API and frontend loading',
          'Backend deployment to Render/Railway',
          'Frontend deployment to Vercel',
          'End-to-end testing on live environment',
        ],
        resources: [
          { label: 'Railway — Free Backend Hosting', url: 'https://railway.app/', type: 'tool' },
          { label: 'Render — Deploy Node/Express App', url: 'https://render.com/docs/deploy-node-express-app', type: 'docs' },
        ],
        project: { title: 'Full Stack SaaS App with Stripe', desc: 'Complete SaaS: user auth with roles, CRUD features, Stripe payment integration, admin dashboard. TypeScript throughout. Full deployment.' },
      },
    ],
  },
  {
    id: 'm10', phase: 10, title: 'Full Stack Project 2 — Modular + AI',
    color: '#fb923c', glow: 'rgba(251,146,60,0.35)', icon: '🏗️',
    modules: [
      {
        id: 'mod-53-54', num: '53-54', title: 'Planning, Modular Architecture & Setup', time: '~1.5 weeks',
        topics: [
          'Problem statement, requirement analysis with AI',
          'User stories and acceptance criteria',
          'UI/UX prototyping with v0.dev',
          'Mongoose ODM setup and MongoDB Atlas',
          'MVC / Modular pattern: why and how',
          'Folder structure: Models, Controllers, Routes, Services',
          'Feature-based module organization',
          'Shared modules: Middleware, Utils, Config',
        ],
        resources: [
          { label: 'Mongoose Official Docs', url: 'https://mongoosejs.com/docs/guide.html', type: 'docs' },
          { label: 'Mongoose Crash Course — Traversy', url: 'https://www.youtube.com/watch?v=DZBGEVgL2eE', type: 'youtube' },
          { label: 'MVC Architecture — Web Dev Simplified', url: 'https://www.youtube.com/watch?v=98BzS5Oz5E4', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-55-57', num: '55-57', title: 'Core Implementation & Payment Integration', time: '~3 weeks',
        topics: [
          'Modular REST API: each feature as independent module',
          'Mongoose schemas inside feature modules',
          'Controllers and service layers',
          'Auth module: register, login, JWT middleware',
          'RBAC: Admin, User, Moderator protection',
          'Error handling middleware, consistent API responses',
          'Next.js + ShadCN frontend, feature-based modules',
          'Authentication UI with protected routes',
          'Form handling: React Hook Form + Zod validation',
          'Payment integration (Stripe test mode)',
          'Transaction records in MongoDB',
        ],
        resources: [
          { label: 'React Hook Form — Free Library', url: 'https://react-hook-form.com/', type: 'docs' },
          { label: 'Zod — TypeScript Validation', url: 'https://zod.dev/', type: 'docs' },
          { label: 'shadcn/ui — Free React Components', url: 'https://ui.shadcn.com/', type: 'tool' },
        ],
        project: null,
      },
      {
        id: 'mod-58-59', num: '58-59', title: 'AI Integration (Ollama), Code Review & Deployment', time: '~1.5 weeks',
        topics: [
          'AI integration in full-stack projects',
          'Ollama setup: running local AI models (llama3, mistral)',
          'Integrating Ollama API into Express backend',
          'Building an AI-powered feature (content suggestions)',
          'Code review with AI: tools and best practices',
          'Identifying code smells and technical debt',
          'Refactoring: splitting bloated files into modules',
          'Security review and performance optimization',
          'Final deployment: Render + Vercel',
        ],
        resources: [
          { label: 'Ollama — Free Local AI Models', url: 'https://ollama.com/', type: 'tool' },
          { label: 'Ollama + Node.js Integration', url: 'https://www.youtube.com/watch?v=90ozfdsQOKo', type: 'youtube' },
        ],
        project: { title: 'Full Stack E-Commerce / Marketplace', desc: 'Modular MVC backend with Mongoose, Next.js + ShadCN frontend, RBAC, payment, and one AI-powered feature. Full deployment. Your portfolio centerpiece.' },
      },
    ],
  },
  {
    id: 'm11', phase: 11, title: 'AI-Assisted Coding Mastery',
    color: '#4ade80', glow: 'rgba(74,222,128,0.35)', icon: '🤖',
    modules: [
      {
        id: 'mod-61', num: '61', title: 'AI Coding Foundations & Mindset', time: '~1 week',
        topics: [
          'Vibe coding: origin, mindset and vision',
          'Modern workflow: PRD → Spec → Prompt → Review',
          'AI tool landscape 2025/26: Cursor, Copilot, Claude, v0, Bolt, Lovable',
          'From prompt engineering to context engineering',
          'Practical prompt patterns for AI-assisted coding',
          'Writing a PRD with AI, environment setup (Cursor + GitHub)',
          'The golden rules of responsible AI coding',
        ],
        resources: [
          { label: 'Cursor AI — Free Hobby Plan', url: 'https://cursor.com/', type: 'tool' },
          { label: 'Cursor AI Tutorial — Fireship', url: 'https://www.youtube.com/watch?v=gqUQbjsYZLQ', type: 'youtube' },
          { label: 'AI Coding Workflow 2025 — Theo', url: 'https://www.youtube.com/watch?v=ls-J-9BRjms', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-62', num: '62', title: 'Design-to-Code: Figma MCP, Lovable & AI Builders', time: '~1 week',
        topics: [
          'Figma MCP: design-to-code live connection',
          'Homepage and multi-page app generation from Figma',
          'Build full project from Figma specs using Lovable',
          'Bolt.new: full-stack app from one prompt',
          'v0.dev: production-ready React UI from prompts',
          'Troubleshooting when AI output is wrong',
          'Design → AI → Production workflow',
        ],
        resources: [
          { label: 'Figma — Free Tier (3 projects)', url: 'https://www.figma.com/', type: 'tool' },
          { label: 'Bolt.new — AI Full Stack Builder', url: 'https://bolt.new/', type: 'tool' },
          { label: 'v0.dev — Vercel AI UI Generator', url: 'https://v0.dev/', type: 'tool' },
          { label: 'Lovable.dev — AI App Builder', url: 'https://lovable.dev/', type: 'tool' },
        ],
        project: null,
      },
      {
        id: 'mod-63', num: '63', title: 'Cursor AI — Fullstack Agentic Development', time: '~1 week',
        topics: [
          'Cursor: .cursorrules, codebase indexing, Agent Mode',
          'Plan full-stack project with AI-generated architecture',
          'Build frontend: component generation with Cursor',
          'Context pinning, @ symbols, iteration workflow',
          'Build backend: API routes and DB schema with Cursor',
          'MCP integrations: GitHub, Browser, Supabase MCP',
          'Parallel agents with Git worktrees',
          'Deploy to Vercel and run end-to-end tests',
        ],
        resources: [
          { label: 'Cursor Official Docs', url: 'https://docs.cursor.com/', type: 'docs' },
          { label: 'Cursor AI Complete Guide 2025', url: 'https://www.youtube.com/watch?v=1CC88QGQiEA', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-64', num: '64', title: 'Claude Code — Terminal-Based Agentic Dev', time: '~4 days',
        topics: [
          'What is Claude Code? Why it is different from Cursor',
          'Installation, setup and first run',
          'CLAUDE.md: the AI constitution of your project',
          'Slash commands and skills (reusable workflows)',
          'Hooks: automatic guardrails and quality gates',
          'Subagents and agent teams for parallel work',
          'Plan/Execute/Review professional workflow',
          'Build a SaaS feature end-to-end with Claude Code',
        ],
        resources: [
          { label: 'Claude Code Official Docs', url: 'https://docs.anthropic.com/en/docs/claude-code/overview', type: 'docs' },
          { label: 'Claude Code Full Tutorial', url: 'https://www.youtube.com/watch?v=O_dwj0eAFCk', type: 'youtube' },
        ],
        project: null,
      },
      {
        id: 'mod-65', num: '65', title: 'Code Quality — Testing, Review & Security', time: '~1 week',
        topics: [
          'Why code quality matters more with AI coding',
          'AI code review with CodeRabbit (auto-review PRs)',
          'Writing and running automated tests with AI',
          'Refactoring to MVC/clean architecture with Cursor agents',
          'Security review: finding and fixing vulnerabilities with AI',
          'Parallel AI agents: two tasks simultaneously',
          'Ethical guardrails for AI-generated code',
        ],
        resources: [
          { label: 'CodeRabbit — Free for Open Source', url: 'https://coderabbit.ai/', type: 'tool' },
          { label: 'Jest — Free JS Testing Framework', url: 'https://jestjs.io/docs/getting-started', type: 'docs' },
          { label: 'Vitest — Vite-native Testing', url: 'https://vitest.dev/', type: 'docs' },
        ],
        project: null,
      },
      {
        id: 'mod-66', num: '66-67', title: 'AI Ecosystem, Deployment & Final Capstone', time: '~1 week',
        topics: [
          'AI IDE exploration: Cursor, Windsurf, Zed, OpenCode',
          'Local AI with Ollama: run models offline',
          'Lovable: database-backed apps with auth and analytics',
          'Firebase Studio + Google AI Studio',
          'Deployment masterclass: Vercel, Render, Netlify',
          'Custom domain with free SSL via Cloudflare',
          'UAT (User Acceptance Testing)',
          'Final project: build with 3 AI tools, record demo video',
        ],
        resources: [
          { label: 'Windsurf IDE — Free AI Code Editor', url: 'https://codeium.com/windsurf', type: 'tool' },
          { label: 'Cloudflare — Free Custom Domain + SSL', url: 'https://www.cloudflare.com/', type: 'tool' },
          { label: 'Netlify — Free Hosting + CI/CD', url: 'https://netlify.com/', type: 'tool' },
        ],
        project: { title: 'Capstone: Real-World App with 3 AI Tools', desc: 'Build and deploy a production-ready app using Cursor, v0.dev, and Claude Code (or similar). Custom domain + SSL. Record a 3-5 min demo video. This is your final portfolio showcase.' },
      },
    ],
  },
];

const TYPE_META = {
  youtube: { bg: 'rgba(239,68,68,0.18)', text: '#f87171', label: 'YT' },
  docs:    { bg: 'rgba(59,130,246,0.18)', text: '#60a5fa', label: 'DOC' },
  site:    { bg: 'rgba(16,185,129,0.18)', text: '#34d399', label: 'SITE' },
  tool:    { bg: 'rgba(245,158,11,0.18)', text: '#fbbf24', label: 'TOOL' },
};

function getAllTopicIds() {
  const ids = [];
  MILESTONES.forEach(m => m.modules.forEach(mod =>
    mod.topics.forEach((_, ti) => ids.push(`${mod.id}_t${ti}`))
  ));
  return ids;
}
const ALL_TOPIC_IDS = getAllTopicIds();

// ─── API HELPERS ──────────────────────────────────────────────────────────────
async function apiAuth(action, username, password) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, username, password }),
  });
  return res.json();
}
async function apiLoadProgress(username) {
  const res = await fetch(`/api/progress?username=${encodeURIComponent(username)}`);
  return res.json();
}
async function apiSaveProgress(username, checked, theme) {
  await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, checked, theme }),
  });
}

// ─── STAR FIELD CANVAS ───────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      o: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.25 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const nebula = [
      { x: W * 0.15, y: H * 0.25, r: 320, c: 'rgba(139,92,246,' },
      { x: W * 0.85, y: H * 0.6,  r: 280, c: 'rgba(6,182,212,' },
      { x: W * 0.5,  y: H * 0.8,  r: 200, c: 'rgba(192,132,252,' },
    ];

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#04060f';
      ctx.fillRect(0, 0, W, H);

      nebula.forEach(n => {
        const pulse = 0.03 + 0.01 * Math.sin(t * 0.008 + n.x);
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, n.c + pulse + ')');
        g.addColorStop(1, n.c + '0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      stars.forEach(s => {
        s.twinkle += 0.018;
        const alpha = s.o * (0.6 + 0.4 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      });

      t++;
      animId = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

// ─── GLASS STYLES ─────────────────────────────────────────────────────────────
const glass = (opacity = 0.07, blur = 16, border = 'rgba(255,255,255,0.08)') => ({
  background: `rgba(255,255,255,${opacity})`,
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
  border: `1px solid ${border}`,
});

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('auth');
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [checked, setChecked] = useState({});
  const [openMilestones, setOpenMilestones] = useState(new Set(['m0']));
  const [openModules, setOpenModules] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('roadmap_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user.username);
      apiLoadProgress(user.username).then(data => {
        setChecked(data.checked || {});
        setView('roadmap');
      });
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) { setAuthError('Fill in both fields.'); return; }
    setLoading(true);
    const data = await apiAuth('register', username.trim(), password);
    setLoading(false);
    if (data.error) { setAuthError(data.error); return; }
    localStorage.setItem('roadmap_user', JSON.stringify({ username: data.username }));
    setCurrentUser(data.username);
    setChecked({});
    setView('roadmap');
    showToast('Account created! Welcome 🎉');
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) { setAuthError('Fill in both fields.'); return; }
    setLoading(true);
    const data = await apiAuth('login', username.trim(), password);
    if (data.error) { setAuthError(data.error); setLoading(false); return; }
    const progress = await apiLoadProgress(data.username);
    setLoading(false);
    localStorage.setItem('roadmap_user', JSON.stringify({ username: data.username }));
    setCurrentUser(data.username);
    setChecked(progress.checked || {});
    setView('roadmap');
    showToast(`Welcome back, ${data.username}! 👋`);
  };

  const handleLogout = () => {
    localStorage.removeItem('roadmap_user');
    setCurrentUser(null); setChecked({});
    setView('auth'); setAuthMode('login');
    setUsername(''); setPassword(''); setAuthError('');
  };

  const toggleTopic = useCallback(async (topicId) => {
    setChecked(prev => {
      const next = { ...prev };
      if (next[topicId]) delete next[topicId]; else next[topicId] = true;
      if (currentUser) apiSaveProgress(currentUser, next, 'dark');
      return next;
    });
  }, [currentUser]);

  const moduleProgress = (mod) => {
    const total = mod.topics.length;
    const done = mod.topics.filter((_, i) => checked[`${mod.id}_t${i}`]).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  };
  const milestoneProgress = (ms) => {
    let done = 0, total = 0;
    ms.modules.forEach(mod => { const p = moduleProgress(mod); done += p.done; total += p.total; });
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  };
  const overall = (() => {
    const done = ALL_TOPIC_IDS.filter(id => checked[id]).length;
    const total = ALL_TOPIC_IDS.length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  })();

  const toggleMs = (id) => setOpenMilestones(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleMod = (id) => setOpenModules(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  if (!mounted) return null;

  // ── AUTH ────────────────────────────────────────────────────────────────────
  if (view === 'auth') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden', background: '#04060f' }}>
        <StarField />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(139,92,246,0.3))', border: '1px solid rgba(6,182,212,0.4)', marginBottom: '1rem', fontSize: '1.8rem' }}>🗺️</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #06b6d4, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {authMode === 'login' ? 'Welcome back' : 'Join the journey'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>
              {authMode === 'login' ? 'Sign in to continue your roadmap' : 'Your progress syncs across all devices'}
            </div>
          </div>

          {/* Card */}
          <div style={{ ...glass(0.06, 20, 'rgba(255,255,255,0.1)'), borderRadius: 24, padding: '2rem', boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 0 120px rgba(6,182,212,0.08)' }}>
            {authError && (
              <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.35)', borderRadius: 10, padding: '0.7rem 1rem', fontSize: '0.83rem', color: '#f87171', marginBottom: '1.25rem' }}>
                ⚠ {authError}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Username</label>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setAuthError(''); }}
                onKeyDown={e => e.key === 'Enter' && (authMode === 'login' ? handleLogin() : handleRegister())}
                placeholder="e.g. sayem_dev"
                style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: "'Space Grotesk', sans-serif" }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                onKeyDown={e => e.key === 'Enter' && (authMode === 'login' ? handleLogin() : handleRegister())}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: "'Space Grotesk', sans-serif" }}
              />
            </div>

            <button
              onClick={authMode === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              style={{ width: '100%', padding: '0.9rem', background: loading ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg, #06b6d4, #8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em', boxShadow: loading ? 'none' : '0 0 30px rgba(139,92,246,0.35)', marginBottom: '1.25rem' }}
            >
              {loading ? 'Please wait…' : authMode === 'login' ? 'Sign in →' : 'Create account →'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>
              {authMode === 'login' ? (<>No account?{' '}<span style={{ color: '#06b6d4', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setAuthMode('register'); setAuthError(''); }}>Register free</span></>) : (<>Already have one?{' '}<span style={{ color: '#06b6d4', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setAuthMode('login'); setAuthError(''); }}>Sign in</span></>)}
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {['11 Milestones', '60+ Modules', 'Progress Sync', '100% Free'].map(b => (
              <span key={b} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.25rem 0.7rem', borderRadius: 99 }}>✦ {b}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── ROADMAP ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#04060f', color: '#e2eaf8', fontFamily: "'Space Grotesk', sans-serif", position: 'relative' }}>
      <StarField />

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, ...glass(0.06, 24, 'rgba(255,255,255,0.07)'), borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', height: 58 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🗺️</span>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', background: 'linear-gradient(135deg, #06b6d4, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FullStack Roadmap</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, padding: '0.3rem 0.8rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>👤</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{currentUser}</span>
          </div>
          <button onClick={handleLogout} style={{ ...glass(0.05, 10, 'rgba(255,255,255,0.08)'), borderRadius: 8, padding: '0.35rem 0.9rem', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 600 }}>
            Sign out
          </button>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* HERO */}
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem 2.5rem' }}>
          <div style={{ display: 'inline-block', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#06b6d4', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', padding: '0.35rem 1.1rem', borderRadius: 99, marginBottom: '1.25rem' }}>
            Free Mirror — Programming Hero Batch 14
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1rem' }}>
            AI-Driven Full Stack<br />
            <span style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #a78bfa 50%, #e879f9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Web Engineering
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', maxWidth: 520, margin: '0 auto' }}>
            Your personal self-paced roadmap. Check topics as you learn — progress syncs to the cloud.
          </p>
        </div>

        {/* OVERALL PROGRESS */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
          <div style={{ ...glass(0.07, 20, 'rgba(255,255,255,0.1)'), borderRadius: 20, padding: '1.5rem 1.75rem', boxShadow: '0 0 40px rgba(6,182,212,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Overall Progress</span>
                <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>{overall.done} of {overall.total} topics</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.8rem', background: 'linear-gradient(135deg, #06b6d4, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{overall.pct}%</span>
            </div>
            {/* Master progress bar */}
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem' }}>
              <div style={{ height: '100%', width: `${overall.pct}%`, background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #e879f9)', borderRadius: 99, transition: 'width 0.6s ease', boxShadow: '0 0 12px rgba(139,92,246,0.6)' }} />
            </div>
            {/* Phase pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {MILESTONES.map(ms => {
                const p = milestoneProgress(ms);
                const done = p.pct === 100;
                return (
                  <button key={ms.id}
                    onClick={() => { toggleMs(ms.id); setTimeout(() => { document.getElementById(ms.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: 8, border: `1px solid ${done ? ms.color + '55' : 'rgba(255,255,255,0.08)'}`, background: done ? ms.color + '18' : 'rgba(255,255,255,0.04)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, color: done ? ms.color : 'rgba(255,255,255,0.35)', transition: 'all 0.2s' }}
                    title={`${ms.title} — ${p.pct}%`}>
                    {ms.icon} M{ms.phase} <span style={{ opacity: 0.6 }}>{p.pct}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* MILESTONES */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          {MILESTONES.map(ms => {
            const msOpen = openMilestones.has(ms.id);
            const msProg = milestoneProgress(ms);
            return (
              <div key={ms.id} id={ms.id} style={{ marginBottom: '0.75rem', borderRadius: 20, overflow: 'hidden', ...glass(0.05, 16, msOpen ? ms.color + '33' : 'rgba(255,255,255,0.07)'), boxShadow: msOpen ? `0 0 40px ${ms.glow}` : 'none', transition: 'box-shadow 0.4s, border-color 0.3s' }}>

                {/* Milestone Header */}
                <div onClick={() => toggleMs(ms.id)} style={{ padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', background: msOpen ? `linear-gradient(135deg, ${ms.color}10, transparent)` : 'transparent', transition: 'background 0.3s' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: ms.color + '18', border: `1.5px solid ${ms.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0, boxShadow: `0 0 16px ${ms.glow}` }}>
                    {ms.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: '#e2eaf8' }}>{ms.title}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.55rem', background: ms.color + '18', color: ms.color, borderRadius: 6, border: `1px solid ${ms.color}33`, letterSpacing: '0.06em' }}>PHASE {ms.phase}</span>
                      {msProg.pct === 100 && <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.55rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', borderRadius: 6, border: '1px solid rgba(16,185,129,0.3)' }}>✓ COMPLETE</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flex: 1, maxWidth: 180, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${msProg.pct}%`, background: ms.color, borderRadius: 99, transition: 'width 0.4s', boxShadow: `0 0 8px ${ms.glow}` }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>{msProg.done}/{msProg.total} · {msProg.pct}%</span>
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem', transition: 'transform 0.3s', transform: msOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▼</div>
                </div>

                {/* Modules */}
                {msOpen && (
                  <div style={{ padding: '0 0.85rem 0.85rem' }}>
                    {ms.modules.map(mod => {
                      const modOpen = openModules.has(mod.id);
                      const mp = moduleProgress(mod);
                      return (
                        <div key={mod.id} style={{ marginTop: '0.6rem', borderRadius: 14, overflow: 'hidden', ...glass(0.04, 12, modOpen ? ms.color + '30' : 'rgba(255,255,255,0.06)'), transition: 'border-color 0.2s' }}>

                          {/* Module Header */}
                          <div onClick={() => toggleMod(mod.id)} style={{ padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', minWidth: 34, flexShrink: 0 }}>MOD {mod.num}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: mp.pct === 100 ? ms.color : '#e2eaf8', marginBottom: '0.3rem' }}>{mod.title}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: 70, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${mp.pct}%`, background: ms.color, borderRadius: 99, boxShadow: `0 0 6px ${ms.glow}` }} />
                                </div>
                                <span style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.25)' }}>{mp.pct}%</span>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#f59e0b', flexShrink: 0, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.15rem 0.5rem', borderRadius: 6 }}>{mod.time}</span>
                            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', transition: 'transform 0.2s', transform: modOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
                          </div>

                          {/* Module Body */}
                          {modOpen && (
                            <div style={{ padding: '0.5rem 1.1rem 1.1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

                              {/* Topics */}
                              <div style={{ marginBottom: '1.1rem' }}>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.6rem', marginTop: '0.6rem' }}>Topics</div>
                                {mod.topics.map((topic, ti) => {
                                  const tid = `${mod.id}_t${ti}`;
                                  const isChecked = !!checked[tid];
                                  return (
                                    <div key={tid} onClick={() => toggleTopic(tid)}
                                      style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem', padding: '0.45rem 0.5rem', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s', marginBottom: '0.05rem' }}
                                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                      <div style={{ width: 17, height: 17, borderRadius: 5, border: `2px solid ${isChecked ? ms.color : 'rgba(255,255,255,0.15)'}`, background: isChecked ? ms.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, transition: 'all 0.15s', boxShadow: isChecked ? `0 0 10px ${ms.glow}` : 'none' }}>
                                        {isChecked && <span style={{ color: '#000', fontSize: '0.65rem', fontWeight: 900 }}>✓</span>}
                                      </div>
                                      <span style={{ fontSize: '0.84rem', color: isChecked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)', textDecoration: isChecked ? 'line-through' : 'none', lineHeight: 1.5, transition: 'all 0.15s' }}>
                                        {topic}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Resources */}
                              <div style={{ marginBottom: mod.project ? '1rem' : 0 }}>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Free Resources</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                  {mod.resources.map((r, ri) => {
                                    const tc = TYPE_META[r.type] || TYPE_META.site;
                                    return (
                                      <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, textDecoration: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.81rem', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = ms.color + '55'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = ms.color + '10'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 4, background: tc.bg, color: tc.text, flexShrink: 0, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{tc.label}</span>
                                        <span style={{ flex: 1 }}>{r.label}</span>
                                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>↗</span>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Project */}
                              {mod.project && (
                                <div style={{ background: `linear-gradient(135deg, ${ms.color}12, ${ms.color}05)`, border: `1px solid ${ms.color}30`, borderRadius: 12, padding: '1rem 1.1rem', boxShadow: `0 0 20px ${ms.glow}` }}>
                                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: ms.color, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.4rem' }}>🏗 Project</div>
                                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#e2eaf8', marginBottom: '0.3rem' }}>{mod.project.title}</div>
                                  <div style={{ fontSize: '0.81rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{mod.project.desc}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* FOOTER */}
          <div style={{ marginTop: '4rem', textAlign: 'center', ...glass(0.04, 16, 'rgba(255,255,255,0.07)'), borderRadius: 20, padding: '2.5rem 2rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Crafted by</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #06b6d4, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
              Sayem Al Amin
            </div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', maxWidth: 440, margin: '0 auto 1.5rem' }}>
              A free, complete alternative to Programming Hero Batch 14. Every module, every project, every resource — 100% free. Your pace, your progress.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['11 Milestones', '60+ Modules', '30+ Projects', '100% Free', 'Self-Paced'].map(t => (
                <span key={t} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.25rem 0.7rem', borderRadius: 99 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', ...glass(0.15, 20, 'rgba(255,255,255,0.15)'), borderRadius: 12, padding: '0.8rem 1.5rem', fontSize: '0.88rem', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(139,92,246,0.3)', zIndex: 200, whiteSpace: 'nowrap', fontWeight: 600 }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}