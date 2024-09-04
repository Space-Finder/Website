export class APIDown extends Error {
    constructor(cause: any) {
        super(
            "There was an issue making a request to the backend API. It looks like the API is down",
        );
        this.cause = cause;
    }
}
