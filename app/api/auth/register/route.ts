import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest, response:NextResponse){         //user registration
    try {
       const {email,password}= await request.json();

       if(!email || !password){     //validation 
        return NextResponse.json({
            error: "Email and password required"
        }, { status: 400 });
       }

      await connectToDatabase();        //connect to db to check for user existence

      const existingUser=await User.findOne({email})        //user already exists
       if(existingUser){
        return NextResponse.json({
            error:"User already exists"
        },{status:400});
        }

     await User.create({            //new user created
        email,
        password
      })

      return NextResponse.json({
        message:"Created successsfully"
      })


    } catch (error) {
        return NextResponse.json({
            error:"failed to create a user",
        },{status:400})
    }
}