// import NextAuth, { NextAuthOptions, User } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import { JWT } from "next-auth/jwt";

// const prisma = new PrismaClient();

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text", placeholder: "example@example.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials): Promise<User | null> {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing email or password");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) {
//           throw new Error("Invalid email or password");
//         }

//         const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isPasswordValid) {
//           throw new Error("Invalid email or password");
//         }

//         return {
//           id: user.id.toString(),
//           name: user.name,
//           email: user.email,
//           role: user.role ?? "user", // Ensure 'role' is returned if required
//         } as User; // Type assertion to match NextAuth User type
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;  // ✅ Ensure ID is added to JWT
//         token.role = user.role; 
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token.id) {
//         session.user.id = token.id;  // ✅ Ensure ID is included in session
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   }
//   ,
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/auth/login",
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Move authOptions to a separate file

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


