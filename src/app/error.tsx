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
        <div className="mt-20 flex flex-col items-center text-center">
            <section className="bg-white dark:bg-gray-900">
                <div className="mx-auto flex flex-col items-center text-center">
                    <p className="rounded-full bg-blue-50 p-3 text-sm font-medium text-red-500 dark:bg-gray-800">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                        </svg>
                    </p>
                    <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
                        Oops! Something went wrong
                    </h1>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">
                        {error.name}
                        <br /> {error.message}
                    </p>

                    <div className="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
                        <button
                            onClick={() => {
                                router.replace("/");
                            }}
                            className="flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
                        >
                            <span>Go Home</span>
                        </button>

                        <button
                            onClick={handleReset}
                            className="w-1/2 shrink-0 rounded-lg bg-[#0B1328] px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-[#203265] dark:bg-blue-600 dark:hover:bg-[#0B1328] sm:w-auto"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
