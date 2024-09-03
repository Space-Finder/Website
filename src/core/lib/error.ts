export class APIRequestIssue extends Error {
    constructor(cause: any) {
        super(
            "There was an issue making a request to the backend API. Please ensure that this is online.",
        );
        this.cause = cause;
    }
}
