import { Message } from "@/models/User"

export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMesssage?:boolean,
    messages?:Array<Message>
}



