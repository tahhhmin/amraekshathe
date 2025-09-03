import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      accountType?: 'volunteer' | 'organization'
      isAdmin?: boolean
      isVerified?: boolean
    }
  }

  interface User {
    id: string
    accountType?: 'volunteer' | 'organization'
    isAdmin?: boolean
    isVerified?: boolean
  }
}