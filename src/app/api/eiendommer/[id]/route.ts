import { NextResponse } from 'next/server';
import { lastEiendom } from '@/lib/eiendom-loader';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eiendom = await lastEiendom(id);

    if (!eiendom) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(eiendom);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}
