import React from "react";

const Navbar = () => {
    return (
        <nav className="border-black border-b-2">
            <div className="flex justify-between m-6 items-center font-poppins">
                <h1 className="text-2xl">SpaceFinder</h1>
                <button className="text-white text-xl bg-[#0B1328] py-3 px-14 rounded-xl">
                    Login
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
