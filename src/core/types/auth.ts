export type AuthConfig = {
    pages?: {
        newUser?: string;
        signIn?: string;
        signOut?: string;
    };
    token?: {
        accessTokenLifespan?: string | number;
        refreshTokenLifespan?: string | number;
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
    errorURL: string;
};
