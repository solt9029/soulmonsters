declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly FIREBASE_PROJECT_ID: string;
    readonly FIREBASE_PRIVATE_KEY: string;
    readonly FIREBASE_CLIENT_EMAIL: string;
    readonly FIREBASE_DATABASE_URL: string;
    readonly CORS_ORIGIN: string;
    readonly DB_TYPE: 'mysql';
    readonly DB_PORT: string;
    readonly DB_HOST: string;
    readonly DB_USERNAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_DATABASE: string;
    readonly DB_SYNCHRONIZE: 'true' | 'false';
    readonly MOCK_USER: 'true' | 'false';
    readonly MOCK_USER_ID: string;
  }
}
