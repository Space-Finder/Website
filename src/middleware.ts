export { auth as middleware } from "@/core/lib/auth";

export const config = {
    matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
