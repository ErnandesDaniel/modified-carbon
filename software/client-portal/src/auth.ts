import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

interface ProfileWithIss {
  iss?: string;
  sub?: string;
  given_name?: string;
  backendId?: number;
}

export const { auth, handlers } = NextAuth({
  callbacks: {
    jwt({ profile, token }) {
      if (profile) {
        const prof = profile as ProfileWithIss;
        token.sub = String(prof.backendId);
        token.iss = prof.iss;
        token.given_name = prof.given_name;
      }
      return token;
    },

    session({ session, token }) {
      if (session && token) {
        session.sub = token.sub;
        session.iss = token.iss;
        session.userName = token.given_name;
      }
      return session;
    },

    async signIn({ account, profile }) {
      if (!account || !profile) return false;

      try {
        const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Service-Authorization': process.env.SERVICE_AUTHORIZATION_SECRET ?? ''
          },
          body: JSON.stringify({
            provider: profile.iss,
            providerUserId: profile.sub,
            userName: profile.given_name
          })
        });

        if (response.ok) {
          const userId = await response.json();
          (profile as ProfileWithIss).backendId = userId;
          return true;
        }

        console.error('Backend rejected authorization:', response.status);
        return false;
      } catch (error) {
        console.error('Backend connection error:', error);
        return false;
      }
    }
  },
  providers: [
    GoogleProvider({
      authorization: {
        params: {
          prompt: 'select_account'
        }
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  trustHost: true
});
