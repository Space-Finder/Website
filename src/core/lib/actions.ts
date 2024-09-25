"use server";

import { signIn, signOut } from "@auth";

export async function signInOut(signedIn: boolean) {
    return signedIn ? await signOut() : await signIn();
}
