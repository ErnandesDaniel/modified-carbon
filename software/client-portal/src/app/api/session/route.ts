import { NextResponse } from 'next/server';
import { resolveClientToken } from '@/lib/client-token';
import { backendBase, DEMO_COOKIE } from '@/lib/session';

export async function GET() {
  const token = await resolveClientToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(`${backendBase()}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await response.json();
  return NextResponse.json({
    userId: user.id,
    displayName: user.displayName,
    email: user.email,
    role: user.role
  });
}

export async function POST() {
  const response = await fetch(`${backendBase()}/auth/client-dev-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
    cache: 'no-store'
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Login failed' }, { status: 401 });
  }

  const data = await response.json();
  const out = NextResponse.json({
    userId: data.userId,
    displayName: data.displayName,
    email: data.email,
    role: data.role
  });
  out.cookies.set(DEMO_COOKIE, data.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12
  });
  return out;
}

export async function DELETE() {
  const out = NextResponse.json({ ok: true });
  out.cookies.set(DEMO_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return out;
}
