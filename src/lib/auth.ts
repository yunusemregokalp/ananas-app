import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Giriş Yap",
      credentials: {
        phoneOrEmail: { label: "E-posta veya Telefon", type: "text", placeholder: "ornek@mail.com / 5xxxxxxx" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phoneOrEmail || !credentials?.password) {
          throw new Error("Lütfen tüm alanları doldurun")
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.phoneOrEmail },
              { phone: credentials.phoneOrEmail }
            ]
          }
        })

        if (!user || !user.password) {
          throw new Error("Kullanıcı bulunamadı veya şifre hatalı")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Hatalı şifre")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "ananas_secret_key_for_dev",
}
