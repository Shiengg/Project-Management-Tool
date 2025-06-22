export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/",                // Home
    "/dashboard/:path*", // Protected pages
    "/user/:path*",   // Protected pages
    "/project/:path*",
  ],
}