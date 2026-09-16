import { auth } from '@/auth';
import generateJWT from '@/lib/generateJWT';
import { getDemoToken } from '@/lib/session';

export async function resolveClientToken(): Promise<string | null> {
  const demo = await getDemoToken();
  if (demo) {
    return demo;
  }

  const session = await auth();
  if (session?.sub) {
    return generateJWT({ iss: session.iss, sub: session.sub });
  }

  return null;
}
