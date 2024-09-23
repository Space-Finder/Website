declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
        }
    }
}
export {};
