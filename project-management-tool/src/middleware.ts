export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/",                // Home
    "/dashboard/:path*", // Protected pages
    "/profile/:path*",   // Protected pages
    "/settings/:path*",
  ],
}