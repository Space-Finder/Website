import { signIn } from "@core/auth";

export default function Home() {
    return (
        <h1 className="text-blue-600">
            <form
                action={async () => {
                    "use server";
                    await signIn();
                }}
            >
                <button type="submit">Login</button>
            </form>
        </h1>
    );
}
