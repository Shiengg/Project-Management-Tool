import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";

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

        // const { statusCode, data } = await login({
        //   email,
        //   password
        // });
        const { statusCode, data } = {
          statusCode: 200, // Simulating a successful response
          data: {
            id: "user_123456",
            username: "bello_dev",
            fullname: "Bello Developer",
            email: "bello@example.com",
            phoneNumber: "+1234567890",
            image:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/John_Doe%2C_born_John_Nommensen_Duchac.jpg/1200px-John_Doe%2C_born_John_Nommensen_Duchac.jpg",
          },
        };

        if (statusCode) {
          if (statusCode === 401) {
            throw new Error("Invalid email or password.");
          } else if (statusCode === 403) {
            throw new Error("Your account is not authorized to log in.");
          } else if (statusCode >= 500) {
            throw new Error("Server error. Please try again later.");
          } else if (!data) {
            throw new Error("An unexpected error occurred. Please try again.");
          }
        } else {
          throw new Error(
            "Unable to connect to the server. Check your network connection."
          );
        }

        if (data) {
          return data
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Use your custom sign-in page
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User;

      return session;
    },
  },
};
