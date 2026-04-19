import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Query from '@/models/Query';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await dbConnect();
    const queries = await Query.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('symptoms result createdAt');

    return NextResponse.json({ queries });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
