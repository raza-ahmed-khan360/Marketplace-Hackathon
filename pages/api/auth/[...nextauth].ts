import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '', // Provide a fallback empty string to prevent runtime issues
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  // Additional NextAuth configuration...
});
