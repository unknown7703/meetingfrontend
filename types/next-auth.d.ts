import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    email?: string;
    token?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    email?: string;
    accessToken?: string;
  }
}