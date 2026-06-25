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
