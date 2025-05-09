import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Add CORS headers to allow requests from your frontend domain
  res.headers.set('Access-Control-Allow-Origin', 'https://admin-panel-six-jet.vercel.app');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // If it's a preflight request (OPTIONS method), respond with 204 status
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://admin-panel-six-jet.vercel.app',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  return res;
}

// Add a config to specify which routes this middleware applies to
export const config = {
  matcher: '/api/:path*'
}