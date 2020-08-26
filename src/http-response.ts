import { isNullOrUndefined } from "util";
import { IHttpResponse } from "./interfaces/i-http-response";

export class HttpResponse implements IHttpResponse {
  public get statusCode(): number { return this._embeddedResponse.statusCode ? this._embeddedResponse.statusCode : 0; }
  public get statusMessage(): string { return this._embeddedResponse.statusMessage ? this._embeddedResponse.statusMessage : ""; }
  public get request(): any { return this._embeddedResponse.request ? this._embeddedResponse.request : undefined; }
  public get body(): any { return this._embeddedResponse.body ? this._embeddedResponse.body : undefined; }

  private _embeddedResponse: any;

  public constructor(response: any) {
    if (isNullOrUndefined(response)) {
      throw new ReferenceError("response is null or undefined.");
    }

    this._embeddedResponse = response;
  }
}
