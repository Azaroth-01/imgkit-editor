import { authOptions } from "@/lib/auth.option";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/VIdeo";
import { getServerSession } from "next-auth";
import { NextResponse ,NextRequest} from "next/server";


export async function GET(){        //fetching all the videos that are present in the db
    try {
       await connectToDatabase();
       const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
        
       if(!videos || videos.length==0){
        return NextResponse.json(
            [],{status:200})
       }

       return NextResponse.json(videos)
    } catch (error) {
        
            return NextResponse.json({
                error:"failed to load videos"
            },{status:500})
    }
}

export async function POST(request:NextRequest){
    try {
       const session=await getServerSession(authOptions) 
       if(!session){
        return NextResponse.json({
                error:"Unauthorised"
            },{status:401})
       }

       await connectToDatabase()

       const body:IVideo=await request.json()
       if(!body.title || !body.description || !body.videoUrl||!body.thumbnailUrl ){
            return NextResponse.json({error:"Missing fields"
            },{status:401})

       }

       const videoData={...body,
        controls:body?.controls ?? true,
        transformations:{
            height:1920,
            width:1080,
            quality: body.transfromations?.quality ?? 100
        }

       }
       
      const newVideo= await Video.create(videoData)
       return NextResponse.json(newVideo)
    } catch (error) {
        return NextResponse.json({
                error:"Failed to create video"
            },{status:500})
    }
}