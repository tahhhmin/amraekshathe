import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/connectDB';
import Volunteer from '@/models/Volunteer';
import Organization from '@/models/Organization';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          
          // Check if user exists in either collection
          const existingVolunteer = await Volunteer.findOne({ email: user.email });
          const existingOrganization = await Organization.findOne({ email: user.email });
          
          if (existingVolunteer || existingOrganization) {
            return true; // User exists, let them in
          }
          
          // New user - we'll create them in the session callback
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return true;
    },
    
    async session({ session }) {
      if (session.user?.email) {
        await dbConnect();
        
        // Check if user exists
        let dbUser = await Volunteer.findOne({ email: session.user.email });
        let accountType = 'volunteer';
        
        if (!dbUser) {
          dbUser = await Organization.findOne({ email: session.user.email });
          accountType = 'organization';
        }
        
        // If user doesn't exist, create them based on localStorage choice
        if (!dbUser) {
          // This is a new user, create account based on type
          // We can't access localStorage here, so we'll handle this differently
          return session; // Return session without user data, handle creation in dashboard
        }
        
        return {
          ...session,
          user: {
            ...session.user,
            id: dbUser._id.toString(),
            accountType,
            isAdmin: dbUser.isAdmin || false,
            isVerified: dbUser.isVerified || false,
          },
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});

export { handler as GET, handler as POST };