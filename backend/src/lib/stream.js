import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiSecret=process.env.STREAM_API_SECRET;
const apikey=process.env.STREAM_API_KEY;

if(!apikey || !apiSecret){
    console.error("stream api key or secret missing");
}

const streamClient=StreamChat.getInstance(apikey, apiSecret);

//function for creating or updating user on stream
export const upsertStreamUser=async (userData)=>{
    try{
        await streamClient.upsertUsers([userData]);
        return userData
    }
    catch(error){
        console.error("error upserting Stream User",error);
    }
};

export const generateStreamToken = (userId)=>{};