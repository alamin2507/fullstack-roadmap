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
