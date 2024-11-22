// app/api/swagger/route.ts
import { getApiDocs } from '@/lib/swagger';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(getApiDocs());
}