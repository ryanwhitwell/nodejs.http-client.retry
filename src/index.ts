import { HttpClient } from "./http-client";

export * from "./interfaces/i-http-auth-options";
export * from "./interfaces/i-http-header";
export * from "./interfaces/i-http-client-options";
export * from "./interfaces/i-http-response";
export * from "./interfaces/i-http-client-agent-options";

export const httpClient = new HttpClient();
