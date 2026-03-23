import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    
    // Admin rotaları koruması
    if (path.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url))
    }
    
    // Hizmet Veren rotaları koruması
    if (path.startsWith("/provider") && token?.role !== "PROVIDER") {
      return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ["/admin/:path*", "/provider/:path*", "/dashboard/:path*"]
}
