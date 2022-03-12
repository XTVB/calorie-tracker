declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    ACCESS_TOKEN_SECRET: string;
    CORS_ORIGIN: string;
  }
}
