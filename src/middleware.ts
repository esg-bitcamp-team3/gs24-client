// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { checkLogin } from "./lib/api/auth";

export async function middleware(request: NextRequest) {
  //   const token = request.cookies.get('JSESSIONID')?.value
  //   const url = request.nextUrl.clone()
  //   if (!token) {
  //     url.pathname = '/login'
  //     return NextResponse.redirect(url)
  //   }
  //   return NextResponse.next()
  // }
  // export const config = {
  //   matcher: ['/dashboard/:path*']
}
