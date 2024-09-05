"use client";

import React, { useState } from "react";

const Settings = () => {
    // this is a placeholder page
    const [opacity, setOpacity] = useState(100);

    return (
        <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center text-center">
            <div className="flex flex-col gap-5">
                <h1 className="font-poppins text-xl">Opacity:</h1>
                <input
                    onChange={(e) => {
                        setOpacity(Number(e.target.value));
                    }}
                    type="range"
                    min="0"
                    value={opacity}
                    max="100"
                    className="h-2 w-52 cursor-pointer appearance-none rounded-lg bg-gray-200"
                />
                <style>{`
                body {
                    opacity:  ${opacity / 100};
                }
            `}</style>
            </div>
        </div>
    );
};

export default Settings;
