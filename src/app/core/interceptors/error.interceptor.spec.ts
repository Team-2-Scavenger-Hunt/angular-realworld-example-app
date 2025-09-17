import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
} from "@angular/common/http";
import { errorInterceptor } from "./error.interceptor";

describe("ErrorInterceptor", () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useValue: errorInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should pass through successful requests", () => {
    const testData = { message: "success" };

    httpClient.get("/test").subscribe((response) => {
      expect(response).toEqual(testData);
    });

    const req = httpMock.expectOne("/test");
    req.flush(testData);
  });

  it("should handle 401 errors", () => {
    const errorResponse = { errors: { message: "Unauthorized" } };

    httpClient.get("/test").subscribe({
      next: () => fail("should have failed"),
      error: (error) => {
        expect(error).toEqual(errorResponse);
      },
    });

    const req = httpMock.expectOne("/test");
    req.flush(errorResponse, { status: 401, statusText: "Unauthorized" });
  });

  it("should handle 403 errors", () => {
    const errorResponse = { errors: { message: "Forbidden" } };

    httpClient.get("/test").subscribe({
      next: () => fail("should have failed"),
      error: (error) => {
        expect(error).toEqual(errorResponse);
      },
    });

    const req = httpMock.expectOne("/test");
    req.flush(errorResponse, { status: 403, statusText: "Forbidden" });
  });

  it("should handle 422 validation errors", () => {
    const errorResponse = {
      errors: {
        email: ["has already been taken"],
        password: ["is too short"],
      },
    };

    httpClient.post("/users", {}).subscribe({
      next: () => fail("should have failed"),
      error: (error) => {
        expect(error).toEqual(errorResponse);
      },
    });

    const req = httpMock.expectOne("/users");
    req.flush(errorResponse, {
      status: 422,
      statusText: "Unprocessable Entity",
    });
  });

  it("should handle 500 server errors", () => {
    const errorResponse = { errors: { message: "Internal Server Error" } };

    httpClient.get("/test").subscribe({
      next: () => fail("should have failed"),
      error: (error) => {
        expect(error).toEqual(errorResponse);
      },
    });

    const req = httpMock.expectOne("/test");
    req.flush(errorResponse, {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("should handle network errors", () => {
    httpClient.get("/test").subscribe({
      next: () => fail("should have failed"),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne("/test");
    req.error(new ErrorEvent("Network error"));
  });
});
