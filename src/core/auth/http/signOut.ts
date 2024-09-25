import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AuthConfig } from "@core/types";

export default async function handleLogout(config: AuthConfig) {
    const cookieStore = cookies();

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("csrfToken");

    return redirect(config.pages.signOut);
}
