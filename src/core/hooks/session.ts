import { useContext } from "react";

import { SessionContext } from "@core/auth/provider";
import { SessionContext as SessionContextType } from "@core/types";

export function useSession(): SessionContextType {
    const context = useContext(SessionContext);

    if (!context) {
        throw new Error(
            "useSession must be used within a SessionContextProvider",
        );
    }

    return context;
}
