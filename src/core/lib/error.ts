export class APIDown extends Error {
    constructor(cause: any) {
        super(
            "There was an issue making a request to the backend API. It looks like the API is down",
        );
        this.cause = cause;
    }
}

export class APIRequestError extends Error {
    reason: string;

    constructor(cause: any, reason: string) {
        super("There was an issue making a request to the backend API");
        this.reason = reason;
        this.cause = cause;
    }
}
