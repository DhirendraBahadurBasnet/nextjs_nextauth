import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import dbconnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:'credentials',
            name:'credentials',
            credentials:{
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any):Promise<any> {
                await dbconnect()
                    try {
                       const user = await UserModel.findOne({
                            $or:[
                                {email:credentials.identifier},
                                {username:credentials.identifier}     
                            ]
                        })

                        if(!user){
                            throw new Error("No user found with this email")
                        }
                        if(!user.isVerified){
                            throw new Error('Please verify your account before login')
                        }
                     const isPasswordCorrect =   await bcrypt.compare(credentials.password, user.password)

                     if(isPasswordCorrect){
                        return user
                     }else{
                        throw new Error('Incorrrect password')
                     }
                    }
                     catch (error:any) {
                        throw new Error(error)
                        
                    }
            }
        })
    ],
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
          },
          async jwt({ token, user }) { //from providers credentials returned user
           if(user){
            token._id = user._id?.toString()
            token.isverified = user.isVerified
            token.isAcceptingMessages= user.isAcceptingMessage
            token.username = user.username
           }
            return token
          }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET 
}