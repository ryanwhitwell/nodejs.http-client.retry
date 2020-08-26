import { IHttpHeader } from "./i-http-header";
import { IHttpAuthOptions } from "./i-http-auth-options";
import { IHttpClientAgentOptions } from "./i-http-client-agent-options";

export interface IHttpClientOptions {
  uri: string;
  method: string;
  body?: any;
  formData?: { [key: string]: any };
  automaticallyParseJson?: boolean;   // Automatically stringifies the body to JSON
  headers?: IHttpHeader[];
  auth?: IHttpAuthOptions;
  requestAttemptsCount?: number;
  retryIntervalInMilliseconds?: number;
  retryableStatusCodes?: number[];
  agentOptions?: IHttpClientAgentOptions;
}
