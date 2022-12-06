declare namespace NodeJS {
    export interface ProcessEnv {
        DB_HOST: string;
        PORT: string;
        DB_PORT: string;
        DB_USER: string;
        DB_PASS: string;
    }
}