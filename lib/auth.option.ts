//sign in options providede to the user

import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";


export const authOptions:NextAuthOptions={
    providers: [
   CredentialsProvider({
   name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" }
    },

    async authorize(credentials){
        if(!credentials?.email|| !credentials?.password){
            throw new Error("missing email or password")
        }
        try {
            await connectToDatabase();
            const user=await User.findOne({email:credentials.email})

            if(!user){
                throw new Error("User not found witht this credential")
            }

           const isValid= await bcrypt.compare(credentials.password,user.password)

           if(!isValid){
                throw new Error("password is invalid")
           }

           return {
            id:user._id.toString(),
            eamil:user.email
           }
        } catch (error) {
            throw error;
            
        }
    }
    
})
],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id=user.id
            
            }
            return token;
        },
        async session({ session, token }) {
            if(session.user){
                session.user.id=token.id as string
            }
        return session
    },
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60
    },
    secret:process.env.NEXTAUTH_SECRET
    
}