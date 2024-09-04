export class APIDown extends Error {
    constructor() {
        super(
            "There was an issue making a request to the backend API. It looks like the API is down",
        );
    }
}

export class APIRequestError extends Error {
    constructor() {
        super("There was an issue making a request to the backend API");
    }
}

export class UnableToFetchTeacher extends Error {
    constructor(id: string) {
        super(`Could not find a teacher with this provided user id (${id})`);
    }
}
