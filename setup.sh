#!/bin/bash
# ============================================================
# FULLSTACK ROADMAP — COMPLETE PROJECT SETUP SCRIPT
# By Sayem Al Amin
# Run this INSIDE your already-created Next.js project folder
# ============================================================

echo ""
echo "🚀 Setting up Fullstack Roadmap project files..."
echo ""

# ── 1. CREATE FOLDER STRUCTURE ──────────────────────────────
mkdir -p lib models app/api/auth app/api/progress

echo "✓ Folders created"

# ── 2. .env.local ───────────────────────────────────────────
cat > .env.local << 'ENVEOF'
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/roadmap?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_any_long_random_string_minimum_32_chars
ENVEOF

echo "✓ .env.local created (edit this with your real MongoDB URI)"

# ── 3. lib/mongodb.js ───────────────────────────────────────
cat > lib/mongodb.js << 'MONGOEOF'
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env.local file');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
MONGOEOF

echo "✓ lib/mongodb.js created"

# ── 4. models/User.js ───────────────────────────────────────
cat > models/User.js << 'USEREOF'
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
USEREOF

echo "✓ models/User.js created"

# ── 5. models/Progress.js ───────────────────────────────────
cat > models/Progress.js << 'PROGRESSEOF'
import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  checked: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  theme: {
    type: String,
    default: 'dark',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
PROGRESSEOF

echo "✓ models/Progress.js created"

# ── 6. app/api/auth/route.js ────────────────────────────────
cat > app/api/auth/route.js << 'AUTHEOF'
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Progress from '@/models/Progress';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { action, username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (username.trim().length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }

    if (password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }

    await connectDB();

    // ── REGISTER ──────────────────────────────────────────
    if (action === 'register') {
      const existing = await User.findOne({ username: username.trim().toLowerCase() });
      if (existing) {
        return NextResponse.json({ error: 'Username already taken. Choose another.' }, { status: 400 });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        username: username.trim().toLowerCase(),
        password: hashed,
      });

      // Create empty progress record for new user
      await Progress.create({
        username: user.username,
        checked: {},
        theme: 'dark',
      });

      return NextResponse.json({
        ok: true,
        username: user.username,
        message: 'Account created successfully',
      });
    }

    // ── LOGIN ─────────────────────────────────────────────
    if (action === 'login') {
      const user = await User.findOne({ username: username.trim().toLowerCase() });
      if (!user) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }

      return NextResponse.json({
        ok: true,
        username: user.username,
        message: 'Logged in successfully',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
AUTHEOF

echo "✓ app/api/auth/route.js created"

# ── 7. app/api/progress/route.js ────────────────────────────
cat > app/api/progress/route.js << 'PROGRESSAPIEOF'
import { connectDB } from '@/lib/mongodb';
import Progress from '@/models/Progress';
import { NextResponse } from 'next/server';

// GET /api/progress?username=xxx  — load user's progress
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    await connectDB();
    const doc = await Progress.findOne({ username: username.toLowerCase() });

    return NextResponse.json({
      checked: doc?.checked || {},
      theme: doc?.theme || 'dark',
    });

  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/progress  — save user's progress
export async function POST(req) {
  try {
    const { username, checked, theme } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    await connectDB();

    await Progress.findOneAndUpdate(
      { username: username.toLowerCase() },
      {
        checked: checked || {},
        theme: theme || 'dark',
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Progress POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
PROGRESSAPIEOF

echo "✓ app/api/progress/route.js created"

# ── 8. app/layout.js ────────────────────────────────────────
cat > app/layout.js << 'LAYOUTEOF'
export const metadata = {
  title: 'Free Full Stack Roadmap — by Sayem Al Amin',
  description: 'A free, complete, self-paced alternative to Programming Hero Batch 14. Track your progress through 11 milestones of full stack web development.',
  keywords: 'full stack, web development, roadmap, free, programming hero, self-study',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  );
}
LAYOUTEOF

echo "✓ app/layout.js created"

# ── 9. app/globals.css ──────────────────────────────────────
cat > app/globals.css << 'CSSEOF'
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #253d6e;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3b82f6;
}

/* Remove default button/input focus outlines and replace with custom */
button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions for theme switching */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.15s ease;
}

/* Prevent transition flash on checkboxes */
input[type="checkbox"] {
  transition: none;
}
CSSEOF

echo "✓ app/globals.css created"

# ── 10. app/page.js ─────────────────────────────────────────
cat > app/page.js << 'PAGEEOF'
'use client';

import './globals.css';
import { useState, useEffect, useCallback } from 'react';

// ─── COURSE DATA ─────────────────────────────────────────────────────────────
const MILESTONES = [
  {
    id: 'm0', phase: 0, title: 'Orientation & AI Mindset',
    color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', icon: '🧭',
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
    color: '#38bdf8', bg: 'rgba(56,189,248,0.10)', icon: '🌐',
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
    color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', icon: '⚡',
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
    color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', icon: '✨',
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
    color: '#34d399', bg: 'rgba(52,211,153,0.10)', icon: '🔷',
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
    color: '#60a5fa', bg: 'rgba(96,165,250,0.10)', icon: '⚛️',
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
          { label: 'Vite Official Docs', url: 'https://vitejs.dev/guide/', type: 'docs' },
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
    color: '#f87171', bg: 'rgba(248,113,113,0.10)', icon: '▲',
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
    color: '#e879f9', bg: 'rgba(232,121,249,0.10)', icon: '🔐',
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
    color: '#2dd4bf', bg: 'rgba(45,212,191,0.10)', icon: '🗄️',
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
    color: '#c084fc', bg: 'rgba(192,132,252,0.10)', icon: '🚀',
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
    color: '#fb923c', bg: 'rgba(251,146,60,0.10)', icon: '🏗️',
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
    color: '#4ade80', bg: 'rgba(74,222,128,0.10)', icon: '🤖',
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

const TYPE_COLORS = {
  youtube: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', label: 'YT' },
  docs:    { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', label: 'DOC' },
  site:    { bg: 'rgba(16,185,129,0.15)', text: '#34d399', label: 'SITE' },
  tool:    { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', label: 'TOOL' },
};

function getAllTopicIds() {
  const ids = [];
  MILESTONES.forEach(m => m.modules.forEach(mod => {
    mod.topics.forEach((_, ti) => ids.push(`${mod.id}_t${ti}`));
  }));
  return ids;
}
const ALL_TOPIC_IDS = getAllTopicIds();

const themes = {
  dark: {
    bg: '#080c18', surface: '#0e1525', card: '#121d35', raised: '#172240',
    border: '#1c2e52', borderHi: '#253d6e', txt: '#e2eaf8', txtSub: '#7a97c8', txtMut: '#3d5280',
  },
  light: {
    bg: '#f4f6fb', surface: '#ffffff', card: '#ffffff', raised: '#f0f3fa',
    border: '#dde4f0', borderHi: '#b8c8e8', txt: '#0e1a35', txtSub: '#3a5080', txtMut: '#8fa0c0',
  },
};

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

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [themeKey, setThemeKey] = useState('dark');
  const theme = themes[themeKey];
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

  // Restore session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('roadmap_user');
    const savedTheme = localStorage.getItem('roadmap_theme');
    if (savedTheme) setThemeKey(savedTheme);
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user.username);
      apiLoadProgress(user.username).then(data => {
        setChecked(data.checked || {});
        if (data.theme) setThemeKey(data.theme);
        setView('roadmap');
      });
    }
  }, []);

  const toggleTheme = async () => {
    const next = themeKey === 'dark' ? 'light' : 'dark';
    setThemeKey(next);
    localStorage.setItem('roadmap_theme', next);
    if (currentUser) apiSaveProgress(currentUser, checked, next);
  };

  const showToast = (msg) => {
    setToast(msg);
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
    if (progress.theme) setThemeKey(progress.theme);
    setView('roadmap');
    showToast(`Welcome back, ${data.username}! 👋`);
  };

  const handleLogout = () => {
    localStorage.removeItem('roadmap_user');
    setCurrentUser(null);
    setChecked({});
    setView('auth');
    setAuthMode('login');
    setUsername('');
    setPassword('');
    setAuthError('');
  };

  const toggleTopic = useCallback(async (topicId) => {
    setChecked(prev => {
      const next = { ...prev };
      if (next[topicId]) delete next[topicId];
      else next[topicId] = true;
      if (currentUser) apiSaveProgress(currentUser, next, themeKey);
      return next;
    });
  }, [currentUser, themeKey]);

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

  const S = {
    root: { minHeight: '100vh', background: theme.bg, color: theme.txt, fontFamily: "'Inter', -apple-system, sans-serif", transition: 'background 0.3s, color 0.3s' },
    authWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: theme.bg },
    authCard: { width: '100%', maxWidth: 440, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 20, padding: '2.5rem 2rem', boxShadow: themeKey === 'dark' ? '0 0 60px rgba(59,130,246,0.08)' : '0 8px 40px rgba(14,26,53,0.08)' },
    inputLabel: { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: theme.txtSub, marginBottom: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' },
    input: { width: '100%', padding: '0.75rem 1rem', background: theme.raised, border: `1.5px solid ${theme.border}`, borderRadius: 10, color: theme.txt, fontSize: '0.95rem', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginBottom: '1rem' },
    header: { position: 'sticky', top: 0, zIndex: 50, background: themeKey === 'dark' ? 'rgba(8,12,24,0.92)' : 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${theme.border}`, padding: '0 1.5rem' },
    headerInner: { maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem', height: 56 },
    main: { maxWidth: 1100, margin: '0 auto', padding: '1.5rem' },
  };

  // ─── AUTH VIEW ────────────────────────────────────────────────────────────
  if (view === 'auth') {
    return (
      <div style={S.authWrap}>
        <div style={S.authCard}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2.2rem' }}>🗺️</span>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 800, marginTop: '0.5rem', color: theme.txt }}>
              {authMode === 'login' ? 'Welcome back' : 'Create account'}
            </div>
            <div style={{ fontSize: '0.85rem', color: theme.txtSub, marginTop: '0.3rem' }}>
              {authMode === 'login' ? 'Sign in to continue your journey' : 'Progress saves automatically to the cloud'}
            </div>
          </div>
          {authError && (
            <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, padding: '0.65rem 1rem', fontSize: '0.83rem', color: '#f87171', marginBottom: '1rem' }}>
              {authError}
            </div>
          )}
          <label style={S.inputLabel}>Username</label>
          <input style={S.input} placeholder="e.g. sayem_dev" value={username} onChange={e => { setUsername(e.target.value); setAuthError(''); }} onKeyDown={e => e.key === 'Enter' && (authMode === 'login' ? handleLogin() : handleRegister())} />
          <label style={S.inputLabel}>Password</label>
          <input style={S.input} type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setAuthError(''); }} onKeyDown={e => e.key === 'Enter' && (authMode === 'login' ? handleLogin() : handleRegister())} />
          <button style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} onClick={authMode === 'login' ? handleLogin : handleRegister} disabled={loading}>
            {loading ? 'Please wait…' : authMode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: theme.txtSub }}>
            {authMode === 'login' ? (<>No account? <span style={{ color: '#60a5fa', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setAuthMode('register'); setAuthError(''); }}>Register free</span></>) : (<>Already have one? <span style={{ color: '#60a5fa', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setAuthMode('login'); setAuthError(''); }}>Sign in</span></>)}
          </div>
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: `1px solid ${theme.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: theme.txtMut, marginBottom: '0.5rem' }}>WHAT YOU GET</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['11 Milestones', 'Progress saved', 'Dark & Light', '100% Free'].map(f => (
                <span key={f} style={{ fontSize: '0.75rem', color: theme.txtSub, background: theme.raised, border: `1px solid ${theme.border}`, padding: '0.2rem 0.6rem', borderRadius: 99 }}>✦ {f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── ROADMAP VIEW ─────────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      <header style={S.header}>
        <div style={S.headerInner}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#06b6d4', fontWeight: 600 }}>// fullstack-roadmap</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '0.8rem', color: theme.txtSub }}>👤 <strong style={{ color: theme.txt }}>{currentUser}</strong></span>
          <button onClick={toggleTheme} style={{ background: theme.raised, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '0.35rem 0.7rem', cursor: 'pointer', color: theme.txt, fontSize: '0.85rem' }}>
            {themeKey === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: 8, padding: '0.35rem 0.8rem', cursor: 'pointer', color: theme.txtSub, fontSize: '0.8rem' }}>
            Sign out
          </button>
        </div>
      </header>

      <div style={{ background: themeKey === 'dark' ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 70%)' : 'none', padding: '2.5rem 1.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#06b6d4', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', padding: '0.3rem 1rem', borderRadius: 99, marginBottom: '1rem' }}>Free Mirror of Programming Hero Batch 14</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.6rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '0.7rem', color: theme.txt }}>
          AI-Driven Full Stack Web<br />
          <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Engineering Roadmap</span>
        </h1>
        <p style={{ color: theme.txtSub, fontSize: '0.95rem', maxWidth: 560, margin: '0 auto' }}>Your personal, self-paced roadmap. Check off topics as you learn. Progress saves to the cloud automatically.</p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 1.5rem' }}>
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: theme.txt }}>Overall Progress</span>
              <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: theme.txtSub }}>{overall.done} of {overall.total} topics completed</span>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{overall.pct}%</div>
          </div>
          <div style={{ height: 10, background: theme.raised, borderRadius: 99, overflow: 'hidden', border: `1px solid ${theme.border}` }}>
            <div style={{ height: '100%', width: `${overall.pct}%`, background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)', borderRadius: 99, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {MILESTONES.map(ms => {
              const p = milestoneProgress(ms);
              return (
                <button key={ms.id} onClick={() => { toggleMs(ms.id); setTimeout(() => { const el = document.getElementById(ms.id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }}
                  style={{ background: p.pct === 100 ? `${ms.color}22` : theme.raised, border: `1.5px solid ${p.pct === 100 ? ms.color : theme.border}`, borderRadius: 8, padding: '0.25rem 0.65rem', cursor: 'pointer', color: p.pct === 100 ? ms.color : theme.txtSub, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  title={`${ms.title} — ${p.pct}%`}>
                  {ms.icon} M{ms.phase} <span style={{ color: theme.txtMut, fontWeight: 400 }}>{p.pct}%</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main style={S.main}>
        {MILESTONES.map(ms => {
          const msOpen = openMilestones.has(ms.id);
          const msProg = milestoneProgress(ms);
          return (
            <div key={ms.id} id={ms.id} style={{ marginBottom: '0.85rem', border: `1px solid ${msOpen ? ms.color + '55' : theme.border}`, borderRadius: 16, overflow: 'hidden', background: theme.surface, transition: 'border-color 0.3s' }}>
              <div onClick={() => toggleMs(ms.id)} style={{ padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', background: msOpen ? ms.bg : 'transparent', transition: 'background 0.3s' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: ms.bg, border: `2px solid ${ms.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{ms.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: theme.txt }}>{ms.title}</span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: ms.bg, color: ms.color, borderRadius: 6, border: `1px solid ${ms.color}44`, fontWeight: 600 }}>Phase {ms.phase}</span>
                    {msProg.pct === 100 && <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', borderRadius: 6, fontWeight: 700 }}>✓ Complete</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
                    <div style={{ flex: 1, height: 5, background: theme.raised, borderRadius: 99, overflow: 'hidden', maxWidth: 200 }}>
                      <div style={{ height: '100%', width: `${msProg.pct}%`, background: ms.color, borderRadius: 99, transition: 'width 0.4s' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: theme.txtSub }}>{msProg.done}/{msProg.total} topics · {msProg.pct}%</span>
                  </div>
                </div>
                <div style={{ color: theme.txtMut, fontSize: '1rem', transition: 'transform 0.3s', transform: msOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▼</div>
              </div>

              {msOpen && (
                <div style={{ padding: '0 1rem 1rem' }}>
                  {ms.modules.map(mod => {
                    const modOpen = openModules.has(mod.id);
                    const mp = moduleProgress(mod);
                    return (
                      <div key={mod.id} style={{ marginTop: '0.75rem', background: theme.card, border: `1px solid ${modOpen ? ms.color + '44' : theme.border}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                        <div onClick={() => toggleMod(mod.id)} style={{ padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.background = theme.raised}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: theme.txtMut, minWidth: 36, flexShrink: 0 }}>MOD {mod.num}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: mp.pct === 100 ? ms.color : theme.txt }}>{mod.title}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.3rem' }}>
                              <div style={{ width: 80, height: 3, background: theme.raised, borderRadius: 99, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${mp.pct}%`, background: ms.color, borderRadius: 99, transition: 'width 0.3s' }} />
                              </div>
                              <span style={{ fontSize: '0.7rem', color: theme.txtMut }}>{mp.pct}%</span>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#f59e0b', flexShrink: 0 }}>{mod.time}</span>
                          <span style={{ color: theme.txtMut, fontSize: '0.85rem', transition: 'transform 0.2s', transform: modOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
                        </div>

                        {modOpen && (
                          <div style={{ padding: '0.75rem 1.1rem 1.1rem', borderTop: `1px solid ${theme.border}` }}>
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ fontSize: '0.7rem', color: theme.txtMut, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Topics</div>
                              {mod.topics.map((topic, ti) => {
                                const tid = `${mod.id}_t${ti}`;
                                const isChecked = !!checked[tid];
                                return (
                                  <div key={tid} onClick={() => toggleTopic(tid)}
                                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', padding: '0.45rem 0.5rem', borderRadius: 7, cursor: 'pointer', marginBottom: '0.1rem' }}
                                    onMouseEnter={e => e.currentTarget.style.background = theme.raised}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{ width: 17, height: 17, borderRadius: 4, border: `2px solid ${isChecked ? ms.color : theme.borderHi}`, background: isChecked ? ms.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, transition: 'all 0.15s' }}>
                                      {isChecked && <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900 }}>✓</span>}
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: isChecked ? theme.txtMut : theme.txtSub, textDecoration: isChecked ? 'line-through' : 'none', lineHeight: 1.5 }}>{topic}</span>
                                  </div>
                                );
                              })}
                            </div>
                            <div style={{ marginBottom: mod.project ? '1rem' : 0 }}>
                              <div style={{ fontSize: '0.7rem', color: theme.txtMut, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Free Resources</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                {mod.resources.map((r, ri) => {
                                  const tc = TYPE_COLORS[r.type] || TYPE_COLORS.site;
                                  return (
                                    <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: theme.raised, border: `1px solid ${theme.border}`, borderRadius: 8, textDecoration: 'none', color: theme.txtSub, fontSize: '0.82rem' }}
                                      onMouseEnter={e => { e.currentTarget.style.borderColor = ms.color + '66'; e.currentTarget.style.color = theme.txt; }}
                                      onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.txtSub; }}>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 4, background: tc.bg, color: tc.text, flexShrink: 0, fontFamily: 'monospace' }}>{tc.label}</span>
                                      <span style={{ flex: 1 }}>{r.label}</span>
                                      <span style={{ color: theme.txtMut, fontSize: '0.8rem' }}>↗</span>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                            {mod.project && (
                              <div style={{ background: `linear-gradient(135deg, ${ms.color}12, ${ms.color}06)`, border: `1px solid ${ms.color}33`, borderRadius: 10, padding: '0.85rem 1rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: ms.color, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.35rem' }}>🏗 Project</div>
                                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: theme.txt, marginBottom: '0.25rem' }}>{mod.project.title}</div>
                                <div style={{ fontSize: '0.82rem', color: theme.txtSub, lineHeight: 1.5 }}>{mod.project.desc}</div>
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

        <div style={{ marginTop: '3rem', borderTop: `1px solid ${theme.border}`, paddingTop: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: theme.txtMut, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Roadmap by</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.4rem' }}>Sayem Al Amin</div>
          <p style={{ fontSize: '0.78rem', color: theme.txtMut, maxWidth: 480, margin: '0 auto 1.5rem' }}>A free, complete alternative to the Programming Hero Batch 14 course — using 100% free resources. Your pace, your progress.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['11 Milestones', '60+ Modules', '30+ Projects', '100% Free', 'Self-Paced'].map(t => (
              <span key={t} style={{ fontSize: '0.75rem', color: theme.txtSub, background: theme.raised, border: `1px solid ${theme.border}`, padding: '0.25rem 0.7rem', borderRadius: 99 }}>{t}</span>
            ))}
          </div>
        </div>
      </main>

      {toast && (
        <div style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', background: themeKey === 'dark' ? '#1a2540' : '#fff', border: `1px solid ${theme.borderHi}`, borderRadius: 10, padding: '0.75rem 1.5rem', fontSize: '0.88rem', color: theme.txt, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 200, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
PAGEEOF

echo "✓ app/page.js created (full roadmap app)"

# ── 11. .gitignore ───────────────────────────────────────────
cat > .gitignore << 'GITEOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# next.js
/.next/
/out/

# production
/build

# env files - NEVER commit these
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
GITEOF

echo "✓ .gitignore created"

# ── 12. next.config.js ──────────────────────────────────────
cat > next.config.js << 'NEXTEOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
};

module.exports = nextConfig;
NEXTEOF

echo "✓ next.config.js created"

# ── DONE ────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════"
echo "✅  ALL FILES CREATED SUCCESSFULLY!"
echo "════════════════════════════════════════════════"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "  1. Edit .env.local with your real MongoDB URI"
echo "     Open: .env.local"
echo ""
echo "  2. Test locally:"
echo "     npm run dev"
echo "     Open: http://localhost:3000"
echo ""
echo "  3. Push to GitHub:"
echo "     git init"
echo "     git add ."
echo "     git commit -m 'initial commit'"
echo "     git remote add origin YOUR_GITHUB_URL"
echo "     git push -u origin main"
echo ""
echo "  4. Deploy on Vercel:"
echo "     - Go to vercel.com → New Project → Import your repo"
echo "     - Add environment variables (MONGODB_URI, JWT_SECRET)"
echo "     - Click Deploy"
echo ""
echo "  Your site will be live at: your-project.vercel.app"
echo "════════════════════════════════════════════════"
