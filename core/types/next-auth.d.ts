// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** From DefaultSession.user */
      id: string;
      name?: string | null;
      email?: string;
      image?: string | null;

      /** Our custom fields */
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: number;
      sheet: {
        id: string;
        title: string;
        sheetId: string;
        createdAt: string;
      } | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}
