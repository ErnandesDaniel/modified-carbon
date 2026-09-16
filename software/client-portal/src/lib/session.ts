import { cookies } from 'next/headers';

export const DEMO_COOKIE = 'scms_client_token';

export function backendBase(): string {
  return (process.env.BACKEND_URL ?? 'http://localhost:3001/api').replace(/\/$/, '');
}

export async function getDemoToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(DEMO_COOKIE)?.value;
}
