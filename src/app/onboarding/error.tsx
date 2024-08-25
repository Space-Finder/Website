"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";
import { toast, Bounce } from "react-toastify";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        toast.error("Something went wrong", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    }, []);

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
            <button onClick={handleReset}>Try again</button>
        </div>
    );
}
