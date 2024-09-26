"use server";

import { signIn } from "@auth";

export async function loginAction() {
    return await signIn();
}
