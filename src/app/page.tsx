import { auth } from "@/core/lib/auth";

export default async function Home() {
    const session = await auth();
    if (!session || !session.user) {
        return <>sign in pls</>;
    }

    return (
        <main className="h-[calc(100vh-9rem)]">
            <h1>{session.user.id}</h1>
            <h1>{session.user.name}</h1>
            <h1>{session.user.email}</h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                alt="pfp"
                src={
                    session.user.image ??
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaTChgSpRr9-3TLtz0LyYFS5VIpzzIq7ZJoA&s"
                }
            />
            {/* <div className="h-full flex flex-col items-center justify-between text-center">
                <div className="h-full flex flex-col items-center justify-center text-center gap-12">
                    <h1 className="text-[7rem] leading-snug">
                        Where{" "}
                        <span className="text-[#72563E]">
                            Learn<span className="text-yellow-400">I</span>ng
                        </span>
                        <br />
                        <span className="text-[#12A88C]">Finds</span> its{" "}
                        <span className="underline text-[#DA6F6E]">place</span>
                    </h1>
                    <button className="bg-blue-500 text-white px-20 py-3 rounded-xl text-2xl">
                        Login
                    </button>
                </div>
                <p className="uppercase text-lg text-[#72563E] tracking-[0.15em]">
                    Classroom allocation made simple
                </p>
            </div> */}
        </main>
    );
}
