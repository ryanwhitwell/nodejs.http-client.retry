import { HttpResponse } from "../src/http-response";
import * as nodeMocks from "node-mocks-http";
import { IHttpResponse } from "../src/interfaces/i-http-response";

describe("Http Response Tests", () => {
  test("ctor should not throw error with valid inputs", () => {
    const response: any = nodeMocks.createResponse();

    expect(() => new HttpResponse(response)).not.toThrowError();
  });

  test("ctor should throw error with invalid inputs", () => {
    const response: any = undefined;

    expect(() => new HttpResponse(response)).toThrowError("response is null or undefined.");
  });

  test("Accessors should not throw error when called and values are empty", () => {
    const response: any = nodeMocks.createResponse();
    response.body = undefined;
    response.statusCode = undefined;
    response.statusMessage = undefined;
    response.request = undefined;

    const sut: IHttpResponse = new HttpResponse(response);

    expect(() => sut.body).not.toThrowError();
    expect(() => sut.statusMessage).not.toThrowError();
    expect(() => sut.request).not.toThrowError();
    expect(() => sut.statusCode).not.toThrowError();
  });

  test("Accessors should not throw error when called and values are not empty", () => {
    const response: any = nodeMocks.createResponse();
    response.body = { };
    response.statusCode = 200;
    response.statusMessage = "OK";
    response.request = { };

    const sut: IHttpResponse = new HttpResponse(response);

    expect(() => sut.body).not.toThrowError();
    expect(() => sut.statusMessage).not.toThrowError();
    expect(() => sut.request).not.toThrowError();
    expect(() => sut.statusCode).not.toThrowError();
  });
});
