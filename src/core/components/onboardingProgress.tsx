import React from "react";

const Progress = () => {
    return (
        <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
            <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
                <li className="flex items-center gap-2 bg-white p-2">
                    {/* <span className="size-6 rounded-full bg-gray-100 text-center text-[10px]/6 font-bold">
                                {" "}
                                1{" "}
                            </span> */}

                    <svg
                        className="size-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>

                    <span className="hidden sm:block"> Account Type </span>
                </li>

                <li className="flex items-center gap-2 bg-white p-2">
                    <span className="size-6 rounded-full bg-blue-600 text-center text-[10px]/6 font-bold text-white">
                        2
                    </span>

                    <span className="hidden sm:block"> KAMAR </span>
                </li>

                <li className="flex items-center gap-2 bg-white p-2">
                    <span className="size-6 rounded-full bg-gray-100 text-center text-[10px]/6 font-bold">
                        {" "}
                        3{" "}
                    </span>

                    <span className="hidden sm:block"> Payment </span>
                </li>
            </ol>
        </div>
    );
};

export default Progress;
