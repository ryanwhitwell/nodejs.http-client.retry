# http-client-retry

This is an HTTP client module for Node JS projects that provides applications a unified way to communicate over HTTP with retry logic.

These instructions will help you integrate this module with your Node JS application.

---

## Prerequisites

You'll need a Node JS runtime with NPM installed wherever you plan to run the ```npm install``` command in the context of your microservice. Additionally, this module will work for NodeJS modules written in pure ```Javascript```, however this module is intended to be use in a project written in ```Typescript```. The following instructions take for granted that consuming Node JS applications are written in ```Typescript```.

---

## Installing

A step by step series of examples that tell you how to get this module integrated to your Node JS microservice.

1. Install via NPM command-line-interface
   ```
    npm install http-client-retry@version
   ```

2. Add the following modules as a dependencies in your Node JS microservice project. 

   a. Add the following lines to the ```dependencies``` section of your ```package.json``` file where X.X.X is ...the version you want to include.  
   ```
   "http-client-retry": "X.X.X"
   ```
   
---

## Usage

Import an httpClient instance

```javascript
import { httpClient } from "http-client-retry"
```

Create IHttpClientOptions for your HTTP request.
```javascript
const httpClientOptions: IHttpClientOptions = {
    uri: "http://localhost",
    method: "GET"
};
```

Pass the client options you created to the ```call``` method of the HTTP client instance you imported and ```await``` the ```Result``` object.

```javascript
const response: Response = await httpClient.call(httpClientOptions);
```

---

### IHttpClientOptions Overview

This is the only parameter required to pass into the ```call``` method of the Http Client. Please pay special attention to the behavior the ```retryableStatusCodes``` property. There are HTTP status codes that will be retried by default.

| Parameter                   | Type              | Is Optional | Purpose                                                                                                     | Default Value
| :---------------------------|:------------------| :-----------| :-----------------------------------------------------------------------------------------------------------| :---------------------------------|
| uri                         | string            | false       | URL of the resource you are requesting                                                                      | N/A
| method                      | string            | false       | The HTTP verb you want to use. Available values: "GET", "POST", "PUT", "DELETE", "HEAD"                     | N/A
| body                        | any               |  true       | Object to be sent in body of HTTP request                                                                   | ```undefined```
| automaticallyParseJson      | boolean           |  true       | Automatically parse the JSON in the response body                                                           | true
| resolveWithFullResponse     | boolean           |  true       | Return the entire ```Response``` object or just the ```Response.body``` property                            | true
| headers                     | IHttpHeader[]     |  true       | Collection of key-value pairs added HTTP request                                                            | ```[{"X-Request-ID": <GUID> }]```
| auth                        | IHttpAuthOptions  |  true       | HTTP authorization options                                                                                  | ```undefined```
| requestAttemptsCount        | number            |  true       | How many times to attempt the HTTP request                                                                  | 1
| retryIntervalInMilliseconds | number            |  true       | How long to wait between HTTP request attempts (in milliseconds)                                            | 1000
| retryableStatusCodes        | number[]          |  true       | List of HTTP status codes to *append to the default value* that when returned to the client will be retried | [502, 503, 504]

---

### IHttpHeader Overview

This option allows you to pass in an array of key-value pairs where the key is of type ```string``` and the value is of type ```any```.

By default a custom header of ```"X-Request-ID": <GUID> ``` will be added to each http client request. 

Any headers you provide in the ```IHttpClientOptions``` object will be added to the default header collection which contains the ```"X-Request-ID"``` header mentioned above.

---

### IHttpAuthOptions Overview

If passed as an option, auth should contain the following values:

- ```user``` - Basic authentication username
- ```pass``` - Basic authentication password
- ```bearer``` (optional) - Bearer access token

Without providing a bearer value, Basic authentication will be used.

Bearer authentication is supported, and is activated when the bearer value is available. The value may be either a String or a Function returning a String. Using a function to supply the bearer token is particularly useful if used in conjunction with defaults to allow a single function to supply the last known token at the time of sending a request, or to compute one on the fly.

## Built With

* [npm](https://www.npmjs.com/) - Dependency Management
* [NodeJS](https://nodejs.org/en/) - Runtime

## Authors

* **Ryan Whitwell** - [Email](mailto:ryanwhitwell.developer@gmail.com)