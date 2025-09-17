import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { apiInterceptor } from "./api.interceptor";

describe("ApiInterceptor", () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useValue: apiInterceptor,
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

  it("should add API base URL to requests", () => {
    httpClient.get("/articles").subscribe();

    const req = httpMock.expectOne("https://api.realworld.show/api/articles");
    expect(req.request.url).toBe("https://api.realworld.show/api/articles");
    req.flush({});
  });

  it("should add API base URL to POST requests", () => {
    const testData = { test: "data" };
    httpClient.post("/users/login", testData).subscribe();

    const req = httpMock.expectOne(
      "https://api.realworld.show/api/users/login",
    );
    expect(req.request.url).toBe("https://api.realworld.show/api/users/login");
    expect(req.request.body).toEqual(testData);
    req.flush({});
  });

  it("should add API base URL to PUT requests", () => {
    const testData = { test: "data" };
    httpClient.put("/user", testData).subscribe();

    const req = httpMock.expectOne("https://api.realworld.show/api/user");
    expect(req.request.url).toBe("https://api.realworld.show/api/user");
    expect(req.request.method).toBe("PUT");
    req.flush({});
  });

  it("should add API base URL to DELETE requests", () => {
    httpClient.delete("/articles/test-slug").subscribe();

    const req = httpMock.expectOne(
      "https://api.realworld.show/api/articles/test-slug",
    );
    expect(req.request.url).toBe(
      "https://api.realworld.show/api/articles/test-slug",
    );
    expect(req.request.method).toBe("DELETE");
    req.flush({});
  });

  it("should preserve query parameters", () => {
    httpClient.get("/articles?limit=10&offset=0").subscribe();

    const req = httpMock.expectOne(
      "https://api.realworld.show/api/articles?limit=10&offset=0",
    );
    expect(req.request.url).toBe(
      "https://api.realworld.show/api/articles?limit=10&offset=0",
    );
    req.flush({});
  });
});
