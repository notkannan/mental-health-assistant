// app/api/auth/[...nextauth]/options.ts
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { createClient } from '@supabase/supabase-js';
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

// Define types for the user object
type User = {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "");

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? ""
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials ?? {};

                if (!email || !password) {
                    throw new Error('Email and password are required');
                }

                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .single();

                if (error || !data) {
                    throw new Error('No user found with the given email');
                }

                // Here you should hash the password and compare with the stored hash
                // For simplicity, we assume the password is stored in plain text
                if (data.password !== password) {
                    throw new Error('Invalid password');
                }

                return { 
                    id: data.id, 
                    email: data.email,
                    name: `${data.first_name} ${data.last_name}`,
                    first_name: data.first_name,
                    last_name: data.last_name
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: User }) {
            // Add user ID and custom fields to token when they sign in
            if (user) {
                token.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    first_name: user.first_name,
                    last_name: user.last_name
                };
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            // Add user details including ID to session
            if (token.user) {
                session.user = token.user as any;
            }
            return session;
        },
        async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error'
    },
    secret: process.env.NEXTAUTH_SECRET
};