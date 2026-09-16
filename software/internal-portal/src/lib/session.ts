import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'scms_token';

export function backendBase(): string {
  return (process.env.BACKEND_URL ?? 'http://localhost:3001/api').replace(/\/$/, '');
}

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}
