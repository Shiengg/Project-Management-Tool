import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id?: string;
    username?: string;
    fullname?: string;
    email?: string;
    phoneNumber?: string;
    image?: string;
  }

  interface Session {
    user: User;
  }
}
