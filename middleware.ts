import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(){
        return NextResponse.next()
    },
    {
        callbacks:{
            authorized({req,token}){
              const {pathname}=req.nextUrl;
              if(pathname.startsWith("/api/auth") ||
                pathname==="/login" ||
                pathname==="/register" || pathname==="/" ||pathname.startsWith("/api/videos"))
                return true;

                return !!token;
            }

            
        }
    }
)

export const config={
    matcher:[
        /* matches all request paths except 
        _next/static 
        _next/image
        _favico.ico 
        public folder*/
        "/((?!_next/static|_next/image|favicon.ico|public/).*)"
    ]
}