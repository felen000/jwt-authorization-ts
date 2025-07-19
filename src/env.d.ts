declare namespace NodeJS {
    interface ProcessEnv {
        PORT: string;
        DATABASE_USER: string;
        DATABASE_PASSWORD: string;
        DATABASE_NAME: string;
        JWT_ACCESS_SECRET: string;
        JWT_REFRESH_SECRET: string;
        SMTP_HOST: string;
        SMTP_PORT: string;
        SMTP_USER: string;
        SMTP_PASSWORD: string;
        API_URL: string;
        CLIENT_URL: string;
    }
}