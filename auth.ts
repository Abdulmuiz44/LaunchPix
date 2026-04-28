import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true
    })
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "launchpix-local-auth-secret",
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      try {
        const nextUrl = new URL(url);
        if (nextUrl.origin === baseUrl) return url;
      } catch {
        return `${baseUrl}/dashboard/projects`;
      }

      return `${baseUrl}/dashboard/projects`;
    }
  }
};

export function auth() {
  return getServerSession(authOptions);
}
