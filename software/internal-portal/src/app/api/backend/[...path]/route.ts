import { NextResponse, type NextRequest } from 'next/server';
import { backendBase, getSessionToken } from '@/lib/session';

async function proxy(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path } = await ctx.params;
  const targetUrl = `${backendBase()}/${path.join('/')}${request.nextUrl.search}`;

  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text();

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body,
    cache: 'no-store'
  });

  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('Content-Type') ?? 'application/json' }
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
