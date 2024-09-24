export type AuthConfig = {
    pages?: {
        newUser?: string;
        signIn?: string;
        signOut?: string;
    };
    token?: {
        // Token lifespan is in seconds
        accessTokenLifespan?: number;
        refreshTokenLifespan?: number;
    };
    secrets: {
        accessTokenSecret: string;
        refreshTokenSecret: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
    };
    authBaseURL: string;
};
