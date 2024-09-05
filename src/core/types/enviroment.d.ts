declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            AUTH_SECRET: string;
            AUTH_GOOGLE_ID: string;
            AUTH_GOOGLE_SECRET: string;
            NEXT_PUBLIC_API_URL: string;
        }
    }
}
export {};
