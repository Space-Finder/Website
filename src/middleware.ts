export { auth as middleware } from "@/core/lib/auth";

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|$).*)"],
};
