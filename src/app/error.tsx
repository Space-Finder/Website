"use client";

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string };
}) {
    return (
        <html>
            <body>
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
                </div>
            </body>
        </html>
    );
}
