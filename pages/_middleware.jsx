import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    //Token will exist if the user is logged in
    const token = await getToken({req, secret: process.env.JWT_SECRET})

    //We will allow the req to go through if the following is true
    //1. If the token exists
    //2.Its a request from next-auth session and provider fetching

    const {pathname} = req.nextUrl;
    if(pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }

    //Redirect then to login if they don't have token and are requesting a protected route
    if(!token && pathname!='/login')
    return NextResponse.redirect('/login');
} 