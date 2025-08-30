import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    volunteer: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface Volunteer {
    id: string
  }
}