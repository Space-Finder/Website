"use client";

import React, { useState } from "react";
import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navbar from "@components/navbar";

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <Theme hasBackground={false}>
                <Navbar />
                {children}
                <ToastContainer />
            </Theme>
        </QueryClientProvider>
    );
};
