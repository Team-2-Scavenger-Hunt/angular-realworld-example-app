import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { UserService } from "./user.service";
import { JwtService } from "./jwt.service";
import { User } from "../user.model";

describe("UserService", () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let jwtService: jasmine.SpyObj<JwtService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const jwtSpy = jasmine.createSpyObj("JwtService", [
      "saveToken",
      "destroyToken",
    ]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: JwtService, useValue: jwtSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    jwtService = TestBed.inject(JwtService) as jasmine.SpyObj<JwtService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should login user and set auth", () => {
    const mockUser: User = {
      email: "test@test.com",
      username: "test",
      token: "token123",
      bio: "",
      image: "",
    };
    const credentials = { email: "test@test.com", password: "password" };

    service.login(credentials).subscribe((response) => {
      expect(response.user).toEqual(mockUser);
    });

    const req = httpMock.expectOne("/users/login");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ user: credentials });
    req.flush({ user: mockUser });

    expect(jwtService.saveToken).toHaveBeenCalledWith("token123");
  });

  it("should register user and set auth", () => {
    const mockUser: User = {
      email: "test@test.com",
      username: "test",
      token: "token123",
      bio: "",
      image: "",
    };
    const credentials = {
      email: "test@test.com",
      password: "password",
      username: "test",
    };

    service.register(credentials).subscribe((response) => {
      expect(response.user).toEqual(mockUser);
    });

    const req = httpMock.expectOne("/users");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ user: credentials });
    req.flush({ user: mockUser });

    expect(jwtService.saveToken).toHaveBeenCalledWith("token123");
  });

  it("should logout user and navigate to home", () => {
    service.logout();
    expect(jwtService.destroyToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("should get current user", () => {
    const mockUser: User = {
      email: "test@test.com",
      username: "test",
      token: "token123",
      bio: "",
      image: "",
    };

    service.getCurrentUser().subscribe((response) => {
      expect(response.user).toEqual(mockUser);
    });

    const req = httpMock.expectOne("/user");
    expect(req.request.method).toBe("GET");
    req.flush({ user: mockUser });

    expect(jwtService.saveToken).toHaveBeenCalledWith("token123");
  });

  it("should handle getCurrentUser error and purge auth", () => {
    service.getCurrentUser().subscribe({
      error: () => {
        expect(jwtService.destroyToken).toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne("/user");
    req.error(new ErrorEvent("Network error"));
  });

  it("should update user", () => {
    const mockUser: User = {
      email: "updated@test.com",
      username: "updated",
      token: "token123",
      bio: "Updated bio",
      image: "",
    };
    const updateData = { email: "updated@test.com", bio: "Updated bio" };

    service.update(updateData).subscribe((response) => {
      expect(response.user).toEqual(mockUser);
    });

    const req = httpMock.expectOne("/user");
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual({ user: updateData });
    req.flush({ user: mockUser });
  });

  it("should set auth correctly", () => {
    const mockUser: User = {
      email: "test@test.com",
      username: "test",
      token: "token123",
      bio: "",
      image: "",
    };

    service.setAuth(mockUser);
    expect(jwtService.saveToken).toHaveBeenCalledWith("token123");

    service.currentUser.subscribe((user) => {
      expect(user).toEqual(mockUser);
    });
  });

  it("should purge auth correctly", () => {
    service.purgeAuth();
    expect(jwtService.destroyToken).toHaveBeenCalled();

    service.currentUser.subscribe((user) => {
      expect(user).toBeNull();
    });
  });

  it("should return correct authentication status", () => {
    const mockUser: User = {
      email: "test@test.com",
      username: "test",
      token: "token123",
      bio: "",
      image: "",
    };

    service.setAuth(mockUser);
    service.isAuthenticated.subscribe((isAuth) => {
      expect(isAuth).toBe(true);
    });

    service.purgeAuth();
    service.isAuthenticated.subscribe((isAuth) => {
      expect(isAuth).toBe(false);
    });
  });
});
