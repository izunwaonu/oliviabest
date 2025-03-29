import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, Role } from "@prisma/client"; // Import Prisma Role enum
import { compare } from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid email or password.");
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        // Ensure role is correctly inferred from Prisma
        const userRole: Role = user.role as Role; 

        // Restrict access for staff
        if (userRole === "STAFF") {
          throw new Error(
            `Access Denied! Hello ${user.name}, we noticed that your role is ${userRole}. 
            As a security measure, management requires all staff members to notify an administrator 
            before gaining access to specific pages. Please contact the admin to request access. 
            Once your access has been granted, log in again to proceed.`
          );
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: userRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: { signIn: "/auth/login" },
};
