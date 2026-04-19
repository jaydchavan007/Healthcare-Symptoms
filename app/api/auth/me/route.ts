import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await dbConnect();
    const user = await User.findById(payload.userId).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
