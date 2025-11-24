// lib/authOptions.ts
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        })

        if (!user) {
          throw new Error("Invalid email or password")
        }

        // Check account status
        if (user.accountStatus === 'SUSPENDED') {
          throw new Error("Your account has been suspended. Please contact support.")
        }

        if (user.accountStatus === 'DELETED') {
          throw new Error("This account no longer exists")
        }

        // Check if account is locked
        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
          const minutesLeft = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 60000)
          throw new Error(`Account is locked. Try again in ${minutesLeft} minutes.`)
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          // Increment failed login attempts
          const failedAttempts = user.failedLoginAttempts + 1
          const updateData: any = {
            failedLoginAttempts: failedAttempts
          }

          // Lock account after 5 failed attempts for 15 minutes
          if (failedAttempts >= 5) {
            updateData.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000)
          }

          await prisma.user.update({
            where: { id: user.id },
            data: updateData
          })

          if (failedAttempts >= 5) {
            throw new Error("Too many failed attempts. Account locked for 15 minutes.")
          }

          throw new Error("Invalid email or password")
        }

        // Check email verification
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in. Check your inbox for the verification link.")
        }

        // Reset failed login attempts and update last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockoutUntil: null,
            lastLoginAt: new Date()
          }
        })

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
        }
      }
    })
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  jwt: { maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.avatar = user.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.avatar = token.avatar as string
      }
      return session
    },
    // This callback handles where users go after login
    async redirect({ url, baseUrl }) {
      // If a specific callback URL is provided, use it
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // If callback URL is on same origin, use it
      else if (new URL(url).origin === baseUrl) return url
      // DEFAULT: Always redirect to dashboard after successful login
      return `${baseUrl}/dashboard`
    }
  },
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}