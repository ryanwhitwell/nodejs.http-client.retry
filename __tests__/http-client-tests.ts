import { HttpClient } from "../src/http-client";
import { IHttpClientOptions } from "../src/interfaces/i-http-client-options";
import * as rp from "request-promise-native";
import { IHttpResponse } from "../src/interfaces/i-http-response";
import { HttpResponse } from "../src/http-response";
import * as nodeMocks from "node-mocks-http";

describe("Http Client - call", () => {
  it("should reject when called with invalid", async () => {
    const options: any = undefined;

    const sut = new HttpClient();

    await expect(sut.call(options)).rejects.toThrowError("options is null or undefined.");
  });

  it("should resolve when called with valid parameters for GET", async () => {

    const response: any = nodeMocks.createResponse();
    response.statusCode = 200;
    response.body = { ID: "abc123" };

    const expectedResponse: IHttpResponse = new HttpResponse(response);

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "GET",
      headers: [{ "X-test-header": "abc123" }]
    };

    jest.spyOn(rp, "get").mockImplementationOnce(() => response);

    const sut = new HttpClient();

    expect.assertions(1);
    await expect(sut.call(options)).resolves.toEqual(expectedResponse);
  });

  it("should resolve when called with valid parameters for PUT", async () => {
    const response: any = nodeMocks.createResponse();
    response.statusCode = 200;
    response.body = { ID: "abc123" };

    const expectedResponse: IHttpResponse = new HttpResponse(response);

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "PUT"
    };

    jest.spyOn(rp, "put").mockImplementationOnce(() => response);

    const sut = new HttpClient();

    expect.assertions(1);
    await expect(sut.call(options)).resolves.toEqual(expectedResponse);
  });

  it("should resolve when called with valid parameters for POST", async () => {
    const response: any = nodeMocks.createResponse();
    response.statusCode = 200;
    response.body = { ID: "abc123" };

    const expectedResponse: IHttpResponse = new HttpResponse(response);

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "POST"
    };

    jest.spyOn(rp, "post").mockImplementationOnce(() => response);

    const sut = new HttpClient();

    expect.assertions(1);
    await expect(sut.call(options)).resolves.toEqual(expectedResponse);
  });

  it("should resolve when called with valid parameters for PATCH", async () => {
    const response: any = nodeMocks.createResponse();
    response.statusCode = 200;
    response.body = { ID: "abc123" };

    const expectedResponse: IHttpResponse = new HttpResponse(response);

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "PATCH"
    };

    jest.spyOn(rp, "patch").mockImplementationOnce(() => response);

    const sut = new HttpClient();

    expect.assertions(1);
    await expect(sut.call(options)).resolves.toEqual(expectedResponse);
  });

  it("should resolve when called with valid parameters for PATCH and response doesn't have a status code", async () => {
    const response: any = { statusCode: 999, body: "Server response is malformed or invalid." };

    const expectedResponse: IHttpResponse = new HttpResponse(response);

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "PATCH"
    };

    jest.spyOn(rp, "patch").mockImplementationOnce(() => response);

    const sut = new HttpClient();

    await expect(sut.call(options)).resolves.toEqual(expectedResponse);
  });

  it("should resolve when called with valid parameters for DELETE", async () => {
    const response: any = nodeMocks.createResponse();
    response.statusCode = 200;
    response.body = { ID: "abc123" };

    const expectedResponse: IHttpResponse = new HttpResponse(response);

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "DELETE",
      retryableStatusCodes: [103]
    };

    jest.spyOn(rp, "delete").mockImplementationOnce(() => response);

    const sut = new HttpClient();

    await expect(sut.call(options)).resolves.toEqual(expectedResponse);
  });

  it("should resolve when called with valid parameters for HEAD", async () => {
    const response: any = nodeMocks.createResponse();
    response.statusCode = 200;
    response.body = { ID: "abc123" };

    const expectedResponse: IHttpResponse = new HttpResponse(response);

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "HEAD",
      retryIntervalInMilliseconds: 1000
    };

    jest.spyOn(rp, "head").mockImplementationOnce(() => response);

    const sut = new HttpClient();

    await expect(sut.call(options)).resolves.toEqual(expectedResponse);
  });

  it("should reject with error when called with invalid HTTP verb", async () => {
    const expectedError = new HttpResponse({ statusCode: 999, body: "Server request or response is malformed or invalid." });

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "UNKNOWN"
    };

    const sut = new HttpClient();

    await expect(sut.call(options)).resolves.toEqual(expectedError);
  });

  it("should reject with error when call throws retryable error as response and attempts run out", async () => {
    const mockBadRetryableResponse = { statusCode: 503, body: { errorMessage: "Unavailable" } };

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "GET"
    };

    jest.spyOn(rp, "get")
    .mockImplementationOnce(() => { throw mockBadRetryableResponse; });

    const sut = new HttpClient();

    await expect(sut.call(options)).rejects.toEqual(mockBadRetryableResponse);
  });

  it("should reject with error when call throws different retryable errors as response multiple times and attempts run out", async () => {
    const response1: any = nodeMocks.createResponse();
    response1.statusCode = 503;
    response1.body = { errorMessage: "Unavailable" };

    const response2: any = nodeMocks.createResponse();
    response2.statusCode = 502;
    response2.body = { errorMessage: "Bad" };

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "GET",
      requestAttemptsCount: 2
    };

    jest.spyOn(rp, "get")
    .mockImplementationOnce(() => { throw response1; })
    .mockImplementationOnce(() => { throw response2; });

    const sut = new HttpClient();

    await expect(sut.call(options)).rejects.toEqual(response2);
  });

  it("should reject with error when call throws different retryable errors passed in by the user as response multiple times and attempts run out", async () => {
    const mockBadRetryableResponse1 = { statusCode: 555, body: { errorMessage: "Unavailable" } };
    const mockBadRetryableResponse2 = { statusCode: 777, body: { errorMessage: "Bad" } };
    const mockBadRetryableResponse3 = { statusCode: 503, body: { errorMessage: "NotGood" } };

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "GET",
      requestAttemptsCount: 3,
      retryIntervalInMilliseconds: 1,
      retryableStatusCodes: [555, 777]
    };

    jest.spyOn(rp, "get")
    .mockImplementationOnce(() => { throw mockBadRetryableResponse1; })
    .mockImplementationOnce(() => { throw mockBadRetryableResponse2; })
    .mockImplementationOnce(() => { throw mockBadRetryableResponse3; });

    const sut = new HttpClient();

    await expect(sut.call(options)).rejects.toEqual(mockBadRetryableResponse3);
  });

  it("should reject with error  that does not have options property when call throws retryable error as response and attempts run out", async () => {
    const mockBadRetryableResponse = { cause: {}, error: { address: "127.0.0.1", code: "ECONNREFUSED", errno: "ECONNREFUSED", message: "connect ECONNREFUSED 127.0.0.1:443", port: "443" }, message: "Error: connect ECONNREFUSED 127.0.0.1:443", name: "", options: { auth: { user: "Username", pass: "Password" } }, response: undefined, stack: "" };

    const options: IHttpClientOptions = {
      uri: "http://localhost",
      method: "GET"
    };

    jest.spyOn(rp, "get")
    .mockImplementationOnce(() => { throw mockBadRetryableResponse; });

    const sut = new HttpClient();

    await expect(sut.call(options)).rejects.not.toHaveProperty("options");
  });
});
