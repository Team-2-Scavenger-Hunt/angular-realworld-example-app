import { TestBed } from "@angular/core/testing";
import { JwtService } from "./jwt.service";

describe("JwtService", () => {
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should save token to localStorage", () => {
    const token = "test-jwt-token";
    service.saveToken(token);
    expect(localStorage.getItem("jwtToken")).toBe(token);
  });

  it("should get token from localStorage", () => {
    const token = "test-jwt-token";
    localStorage.setItem("jwtToken", token);
    expect(service.getToken()).toBe(token);
  });

  it("should return null when no token exists", () => {
    expect(service.getToken()).toBeNull();
  });

  it("should destroy token from localStorage", () => {
    const token = "test-jwt-token";
    localStorage.setItem("jwtToken", token);
    service.destroyToken();
    expect(localStorage.getItem("jwtToken")).toBeNull();
  });

  it("should handle destroying non-existent token", () => {
    expect(() => service.destroyToken()).not.toThrow();
    expect(localStorage.getItem("jwtToken")).toBeNull();
  });
});
