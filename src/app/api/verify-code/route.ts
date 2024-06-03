import dbconnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";
import { Truculenta } from "next/font/google";

export async function POST(request: Request){
    try {
        const {username,code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json({
                success:false,
                messsage:"user not found"
            },{status:500})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json({
                success:true,
                messsage:"Account verified successfully"
            },{status:200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                messsage:"verificaiton code has expired, please signup again to get a new code"
            },{status:400})
        }else{
            return Response.json({
                success:false,
                messsage:"Incorrect verification code"
            },{status:400})
        }


    } catch (error) {
        console.error("error verifying user", error)
        return Response.json({
            success:false,
            messsage:"error verifying user"
        },{status:500})
    }
}