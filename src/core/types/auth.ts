export type AuthConfig = {
    pages: {
        newUser: string;
        signIn: string;
        signOut: string;
    };
    token: {
        accessTokenLifespan: number;
        refreshTokenLifespan: number;
    };
    secrets: {
        accessTokenSecret: string;
        refreshTokenSecret: string;
        csrfTokenSecret: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
    };
    authBaseURL: string;
    errorURL: string;
};

export type Session = {
    id: string;
    name: string;
    email: string;
    image: string | null;
};
