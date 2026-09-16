import { isNil } from 'lodash-es';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import type { ServiceLoginRequestDto, UserIdResponseDto } from '@/api/rest-client/dto';

export const { auth, handlers } = NextAuth({
  callbacks: {
    jwt({ profile, token }) {
      if (!isNil(profile)) {
        token.sub = String(profile.backendId);
        token.iss = profile.iss;
        token.given_name = profile.given_name;
      }
      return token;
    },

    session({ session, token }) {
      if (!isNil(session.user) && !isNil(token)) {
        session.sub = token.sub as string;
        session.iss = token.iss as string;
        session.userName = token.given_name as string;
      }
      return session;
    },

    async signIn({ account, profile }) {
      if (!account || !profile) return false;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
          body: JSON.stringify({
            provider: profile.iss,
            providerUserId: profile.sub,
            userName: profile.given_name
          } as ServiceLoginRequestDto),
          headers: {
            'Content-Type': 'application/json',
            'Service-Authorization': 'my-test-secret-key'
          },
          method: 'POST'
        });

        if (response.ok) {
          const userData: UserIdResponseDto = await response.json();
          profile.backendId = userData.userId;
          return true;
        }

        console.error('Бэкенд отказал в авторизации:', response.status);
        return false;
      } catch (error) {
        console.error('Ошибка связи с бэкендом:', error);
        return false;
      }
    }
  },
  providers: [
    GoogleProvider({
      authorization: {
        params: {
          prompt: 'select_account' //заставляет Google каждый раз показывать окно согласия, что полезно на этапе разработки.
        }
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  trustHost: true
});
