import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import generateJWT from '@/lib/generateJWT';

async function proxyRequest(req: NextRequest) {
  const sessionToken = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const backendToken = await generateJWT({
    iss: sessionToken.iss as string,
    sub: sessionToken.sub as string
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  const targetPath = req.nextUrl.pathname.replace(/^\/api\/proxy/, '');
  const targetUrl = `${baseUrl}${targetPath}${req.nextUrl.search}`;

  const headers = new Headers(req.headers);
  headers.set('Authorization', `Bearer ${backendToken}`);
  headers.delete('host');

  try {
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text();

    const response = await fetch(targetUrl.toString(), {
      body,
      cache: 'no-store',
      headers,
      method: req.method
    });

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json'
      },
      status: response.status
    });
  } catch (error) {
    console.error(`[Proxy Error] ${req.method} ${targetPath}:`, error);
    return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
