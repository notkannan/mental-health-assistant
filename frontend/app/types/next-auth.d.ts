import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extend the user object in the session
   */
  interface Session {
    user: {
      id: string;
      // Include other custom properties here
    } & DefaultSession["user"];
  }

  /**
   * Extend the user returned from authorize callback
   */
  interface User {
    id: string;
    email: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    // Add any other fields your user object might have
  }
}