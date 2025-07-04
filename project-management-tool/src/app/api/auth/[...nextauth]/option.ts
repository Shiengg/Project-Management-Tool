import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import { connectToDatabase } from '@/lib/mongodb';
import UserModel from '@/models/User';
import bcrypt from 'bcrypt';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Email and password are required.");
        }
        const { email, password } = credentials;

        await connectToDatabase();
        const user = await UserModel.findOne({ email });
        if (!user) {
          throw new Error("account doesn't exist.");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Wrong password.");
        }
        // Trả về user, loại bỏ password và chuẩn hóa kiểu dữ liệu
        const userObj = user.toObject();
        Reflect.deleteProperty(userObj, 'password');
        Reflect.deleteProperty(userObj, 'notification');
        // Chuyển các trường null sang undefined để đúng kiểu User
        // if (userObj.username === null) userObj.username = undefined;
        // if (userObj.phoneNumber === null) userObj.phoneNumber = undefined;
        // if (userObj.image === null) userObj.image = undefined;
        return userObj as User;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Use your custom sign-in page
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }

      // Handle updates to the session
      if (trigger === "update" && session) {
        token.user = session.user;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
