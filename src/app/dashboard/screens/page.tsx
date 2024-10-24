import React from "react";

import prisma from "@db/orm";

const Screens = async () => {
    const commons = await prisma.common.findMany();

    return (
        <div className="m-4 grid grid-cols-2 items-center justify-center gap-4 md:grid-cols-4">
            {commons.map((common) => {
                return (
                    <img
                        alt={common.name}
                        key={common.id}
                        width={1080}
                        height={1920}
                        className="h-auto w-full rounded-md shadow-lg"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/image?common_id=${common.id}`}
                    />
                );
            })}
        </div>
    );
};

export default Screens;
