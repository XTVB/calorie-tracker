declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
  }
}
