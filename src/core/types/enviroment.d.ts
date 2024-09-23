declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
            NEXT_PUBLIC_BASE_URL: string;
            NEXT_PUBLIC_API_URL: string;
        }
    }
}
export {};
