import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/mongodb';
import Query from '@/models/Query';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { symptoms } = await req.json();
    if (!symptoms || symptoms.trim().length < 3) {
      return NextResponse.json({ error: 'Please describe your symptoms' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `You are a medical information assistant providing educational content only.

A user reports these symptoms: "${symptoms}"

Please provide:
1. **Possible Conditions** - List 3-5 potential conditions that may match these symptoms.
2. **Recommended Next Steps** - Practical advice on what to do next (e.g., rest, hydration, see a doctor, etc.).

Make it very short. Just two paragraphs one for possible conditions and one for recommendations.
Keep the response clear and compassionate. Use plain language.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    await dbConnect();
    await Query.create({
      userId: payload.userId,
      symptoms: symptoms.trim(),
      result: text,
    });

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error('Symptoms API error:', error);
    if (error?.message?.includes('API_KEY')) {
      return NextResponse.json({ error: 'AI service configuration error. Please check your API key.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to analyze symptoms. Please try again.' }, { status: 500 });
  }
}
