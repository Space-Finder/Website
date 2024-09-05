export { auth as middleware } from "@/core/lib/auth";

// list of paths to be protected by auth js
export const config = {
    matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
