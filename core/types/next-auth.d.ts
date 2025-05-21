import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    sheet?: Sheet | null;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      sheet?: Sheet | null;
      accessToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
  }
}
