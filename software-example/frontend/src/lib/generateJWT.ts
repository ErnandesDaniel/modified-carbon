import { SignJWT } from 'jose';

export interface SessionData {
  iss?: string | null;
  sub?: string | null;
}

async function generateJWT(session: SessionData, expirationTime = '1h'): Promise<string> {
  const secret = process.env.AUTH_SECRET ?? '';

  const encodedSecret = new TextEncoder().encode(secret);

  return new SignJWT({
    sub: session.sub as string
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(session.iss ?? '')
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(encodedSecret);
}

export default generateJWT;
