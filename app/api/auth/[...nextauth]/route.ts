// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          console.log(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/auth/login`);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_FASTAPI_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Login failed");
          }

          const data = await response.json();

          if (!data.user_id || !data.token) {
            throw new Error("Invalid response from authentication server");
          }

          return {
            id: data.user_id,
            email: credentials.email,
            token: data.token,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.accessToken = user.token;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
