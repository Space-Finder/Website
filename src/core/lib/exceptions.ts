// takes in an Error object and returns an error message
export const extractErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }

    if (typeof error === "string") {
        return error;
    }

    return "Uh Oh! Something Went Wrong :(";
};
