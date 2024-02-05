declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN_BOT: string;
      API_KEY: string;
      API_URL: string;
      MONGOOSE_URL: string;
    }
  }
}

export {};
