
import type {DefaultSession} from 'next-auth';

declare module "next-auth" {
    interface Session extends DefaultSession {
        sub?: string;
        iss?: string;
        userName?: string;
    }
}

