"use client";

import { CSSProperties } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Loader = () => {
    return (
        <div className="h-screen">
            <PulseLoader
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform p-4 text-center"
                size={20}
                loading={true}
                cssOverride={override}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default Loader;
