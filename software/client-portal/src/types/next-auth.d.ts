import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    sub?: string;
    iss?: string;
    userName?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub?: string;
    iss?: string;
    given_name?: string;
    backendId?: number;
  }
}
