import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const res = NextResponse.next();

  // Add CORS headers to allow requests from your frontend domain
  res.headers.set('Access-Control-Allow-Origin', 'https://majesticbridal.in');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // If it's a preflight request (OPTIONS method), respond with 204 status
  if (req.method === 'OPTIONS') {
    return NextResponse.json(null, { status: 204 });
  }

  return res;
}
