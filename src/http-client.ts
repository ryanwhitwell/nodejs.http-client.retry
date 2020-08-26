import { IHttpClient } from "./interfaces/i-http-client";
import { IHttpClientOptions } from "./interfaces/i-http-client-options";
import * as rp from "request-promise-native";
import { isNullOrUndefined } from "util";
import { IHttpResponse } from "./interfaces/i-http-response";

// tslint:disable-next-line:no-submodule-imports
import uuid = require("uuid/v4");
import { IHttpHeader } from "./interfaces/i-http-header";
import { HttpResponse } from "./http-response";

export class HttpClient implements IHttpClient {
  public static async sleep(milliseconds: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
  }

  private static MalformedResponseHttpStatusCode: number = 999;
  private static DefaultRequestAttemptsCount: number = 1;
  private static DefaultRetryIntervalInMilliseconds: number = 1000;
  private static DefaultRetryableStatusCodes: number[] = [502, 503, 504];
  private static DefaultResolveWithFullResponse: boolean = true;
  private static DefaultAutomaticParseJson: boolean = true;

  private static async generateRequestPromiseOptions(options: IHttpClientOptions): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        const defaultHeaders: IHttpHeader[] = new Array<IHttpHeader>();
        defaultHeaders.push({ "X-Request-ID": uuid() });

        const rpOptions: any = {
          uri: options.uri,
          method: options.method,
          body: options.body,
          formData: options.formData,
          auth: options.auth,
          resolveWithFullResponse: HttpClient.DefaultResolveWithFullResponse,
          agentOptions: options.agentOptions,
          json: options.automaticallyParseJson
            ? options.automaticallyParseJson
            : HttpClient.DefaultAutomaticParseJson,
          headers: options.headers
            ? options.headers.concat(defaultHeaders)
            : defaultHeaders
        };

        return resolve(rpOptions);
      } catch (error) {
        return reject(error);
      }
    });
  }

  public async call(options: IHttpClientOptions): Promise<IHttpResponse> {
    return new Promise<IHttpResponse>(async (resolve, reject) => {
      try {
        if (isNullOrUndefined(options)) {
          throw new ReferenceError("options is null or undefined.");
        }

        const rpOptions = await HttpClient.generateRequestPromiseOptions(options);

        let requestAttemptsCount: number = options.requestAttemptsCount ? options.requestAttemptsCount : HttpClient.DefaultRequestAttemptsCount;
        const retryIntervalInMilliseconds: number = options.retryIntervalInMilliseconds ? options.retryIntervalInMilliseconds : HttpClient.DefaultRetryIntervalInMilliseconds;
        const retryableStatusCodes: number[] = options.retryableStatusCodes ? options.retryableStatusCodes.concat(HttpClient.DefaultRetryableStatusCodes) : HttpClient.DefaultRetryableStatusCodes;

        while (requestAttemptsCount > 0) {
          try {
            let response: any|undefined;

            switch (rpOptions.method!.toUpperCase()) {
              case "GET":
                response = await rp.get(rpOptions);
                break;
              case "PUT":
                response = await rp.put(rpOptions);
                break;
              case "POST":
                response = await rp.post(rpOptions);
                break;
              case "PATCH":
                response = await rp.patch(rpOptions);
                break;
              case "DELETE":
                response = await rp.delete(rpOptions);
                break;
              case "HEAD":
                response = await rp.head(rpOptions);
                break;
              default:
                response = undefined;
                break;
            }

            const httpResponse: IHttpResponse = response && response.statusCode
              ? new HttpResponse(response)
              : new HttpResponse({ statusCode: HttpClient.MalformedResponseHttpStatusCode, body: "Server request or response is malformed or invalid." });

            return resolve(httpResponse);
          } catch (error) {
            requestAttemptsCount--;

            if (!error.statusCode || retryableStatusCodes.indexOf(error.statusCode) < 0 || requestAttemptsCount <= 0) {
              throw error;
            }

            await HttpClient.sleep(retryIntervalInMilliseconds);
          }
        }
      } catch (error) {
        delete error.options;
        return reject(error);
      }
    });
  }
}
