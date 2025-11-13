import { NextResponse } from 'next/server';
import { lastAlleEiendommer } from '@/lib/eiendom-loader';

export async function GET() {
  try {
    const eiendommer = await lastAlleEiendommer();
    return NextResponse.json(eiendommer);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
