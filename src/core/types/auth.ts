export type AuthConfig = {
    pages: {
        newUser?: string;
        signIn?: string;
        signOut?: string;
    };
    token: {
        // will be in seconds
        accessTokenLifespan: number;
        refreshTokenLifespan: number;
    };
    secrets: {
        accessTokenSecret: string;
        refreshTokenSecret: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
    };
};
