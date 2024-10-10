import React from "react";

import HomepageButton from "@components/homeButton";

const BACKGROUND_IMAGE = "/gradient.webp"; // TODO: Change this to proper divs or gradient

export const metadata = {
    title: "Space Finder | Home",
    description: "Classroom Allocation Made Simple",
};

export default function Home() {
    return (
        <div>
            <main className="h-[calc(100vh-9rem)] font-poppins">
                <div className="flex h-full flex-col items-center justify-between text-center">
                    <div className="flex h-full flex-col items-center justify-center gap-12 text-center drop-shadow-lg">
                        <h1 className="text-[7rem] leading-snug drop-shadow-lg">
                            Where{" "}
                            <span className="text-[#72563E]">
                                Learn
                                <span className="relative inline-block">
                                    <span className="relative inline-block h-16 w-2 bg-[#F9BC12]">
                                        <span className="absolute left-1/2 top-[-0.78rem] h-0 w-0 -translate-x-1/2 transform border-b-[0.8rem] border-l-[0.28rem] border-r-[0.28rem] border-[#64635C] border-l-transparent border-r-transparent"></span>
                                        <span className="absolute bottom-2 left-0 h-0.5 w-full bg-black"></span>
                                        <span className="absolute bottom-0 left-0 h-2 w-full bg-[#C85A6C]"></span>
                                    </span>
                                </span>
                                ng
                            </span>
                            <br />
                            <span className="text-[#12A88C]">
                                Finds
                            </span> its{" "}
                            <span className="text-[#DA6F6E] underline">
                                Place
                            </span>
                        </h1>
                        <HomepageButton />
                    </div>
                    <p className="text-lg uppercase tracking-[0.15em] text-[#72563E]">
                        Classroom allocation made simple
                    </p>
                </div>
            </main>
            <style>{`
                body {
                    background:  url(${BACKGROUND_IMAGE});
                }
            `}</style>
        </div>
    );
}
