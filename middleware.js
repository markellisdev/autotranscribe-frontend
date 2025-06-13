import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|api).*)", // allow static files
    "/(api|trpc)(.*)",           // protect API routes
  ],
};