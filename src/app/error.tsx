"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();
    function handleReset() {
        startTransition(() => {
            reset();
            router.refresh();
        });
    }
    return (
        <div className="flex h-full flex-col items-center text-center">
            <h1>&quot;Oops&quot; Something went wrong!</h1>
            <h2>{error.name}</h2>
            <h3>{error.message}</h3>
            <form
                action={() => {
                    window.location.href = "/";
                }}
            >
                <button type="submit">Back Home</button>
            </form>
            <button onClick={handleReset}>Try again</button>
        </div>
    );
}
