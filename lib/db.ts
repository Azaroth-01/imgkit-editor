import { error } from "console";
import mongoose from "mongoose";

const MONGODB_URI=process.env.MONGODB_URI!

if(!MONGODB_URI){
    throw new Error("Please define mongo uri in env variables")

}

let cached=global.mongoose      //it stores the connection 

if(!cached){                    //if connection does not exist
    global.mongoose={
        conn:null,
        promise:null
    }
}

export async function  connectToDatabase(){   //connection already exists
    if(cached.conn)
            return cached.conn;

    if(!cached.promise){
        mongoose.connect(MONGODB_URI)
        .then(()=>mongoose.connection)
    }

    try {
        cached.conn=await cached.promise
    } catch (error) {
        cached.promise=null;
        throw error;
        
    }
    return cached.conn
}
    
