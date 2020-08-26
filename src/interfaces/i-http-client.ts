import { IHttpClientOptions } from "./i-http-client-options";
import { IHttpResponse } from "./i-http-response";

export interface IHttpClient {
  call(options: IHttpClientOptions): Promise<IHttpResponse>;
}
