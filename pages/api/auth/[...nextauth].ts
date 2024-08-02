import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

process.env.NEXTAUTH_SECRET = "a19b92f6fd5fe979b45e83992d09fbf7"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        try {
          const response = await axios.post('https://localhost:7126/api/account/Authenticate', {
            email: credentials?.email,
            password: credentials?.password,
          });
          const user = response.data;

          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});