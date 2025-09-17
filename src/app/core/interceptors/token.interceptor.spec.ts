import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { tokenInterceptor } from "./token.interceptor";
import { JwtService } from "../auth/services/jwt.service";

describe("TokenInterceptor", () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let jwtService: jasmine.SpyObj<JwtService>;

  beforeEach(() => {
    const jwtSpy = jasmine.createSpyObj("JwtService", ["getToken"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: JwtService, useValue: jwtSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useValue: tokenInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    jwtService = TestBed.inject(JwtService) as jasmine.SpyObj<JwtService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should add Authorization header when token exists", () => {
    const token = "test-jwt-token";
    jwtService.getToken.and.returnValue(token);

    httpClient.get("/test").subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.get("Authorization")).toBe(`Token ${token}`);
    req.flush({});
  });

  it("should not add Authorization header when no token exists", () => {
    jwtService.getToken.and.returnValue(null as any);

    httpClient.get("/test").subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.has("Authorization")).toBe(false);
    req.flush({});
  });

  it("should add Authorization header to POST requests", () => {
    const token = "test-jwt-token";
    jwtService.getToken.and.returnValue(token);

    httpClient.post("/test", { data: "test" }).subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.get("Authorization")).toBe(`Token ${token}`);
    req.flush({});
  });

  it("should add Authorization header to PUT requests", () => {
    const token = "test-jwt-token";
    jwtService.getToken.and.returnValue(token);

    httpClient.put("/test", { data: "test" }).subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.get("Authorization")).toBe(`Token ${token}`);
    req.flush({});
  });

  it("should add Authorization header to DELETE requests", () => {
    const token = "test-jwt-token";
    jwtService.getToken.and.returnValue(token);

    httpClient.delete("/test").subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.get("Authorization")).toBe(`Token ${token}`);
    req.flush({});
  });
});
