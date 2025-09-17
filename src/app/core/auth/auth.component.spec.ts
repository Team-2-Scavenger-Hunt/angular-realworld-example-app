import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { UserService } from "./services/user.service";
import { Component } from "@angular/core";

@Component({
  selector: "app-auth",
  template: "<div>Mock Auth Component</div>",
})
class MockAuthComponent {
  authType = "login";
  title = "Sign in";
  authForm: any = {
    get: jasmine
      .createSpy("get")
      .and.returnValue({
        hasError: jasmine.createSpy("hasError").and.returnValue(true),
      }),
    patchValue: jasmine.createSpy("patchValue"),
  };
  errors: any = { errors: {} };
  isSubmitting = false;

  ngOnInit() {}
  submitForm() {}
}

describe("AuthComponent", () => {
  let component: MockAuthComponent;
  let fixture: ComponentFixture<MockAuthComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let route: any;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj("UserService", ["login", "register"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    route = {
      snapshot: {
        url: [{ path: "login" }],
      },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MockAuthComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockAuthComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize as login form", () => {
    component.ngOnInit();
    expect(component.authType).toBe("login");
    expect(component.title).toBe("Sign in");
    expect(component.authForm.get("username")).toBeNull();
  });

  it("should add username field for register", () => {
    route.snapshot.url = [{ path: "register" }];
    component.ngOnInit();
    expect(component.authType).toBe("register");
    expect(component.title).toBe("Sign up");
    expect(component.authForm.get("username")).toBeTruthy();
  });

  it("should validate required fields", () => {
    component.ngOnInit();
    expect(component.authForm.get("email")?.hasError("required")).toBe(true);
    expect(component.authForm.get("password")?.hasError("required")).toBe(true);
  });

  it("should submit login form successfully", () => {
    const mockResponse = {
      user: {
        email: "test@test.com",
        username: "test",
        token: "token",
        bio: "",
        image: "",
      },
    };
    userService.login.and.returnValue(of(mockResponse));
    router.navigate.and.returnValue(Promise.resolve(true));

    component.ngOnInit();
    component.authForm.patchValue({
      email: "test@test.com",
      password: "password",
    });

    component.submitForm();

    expect(component.isSubmitting).toBe(true);
    expect(userService.login).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "password",
    });
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("should submit register form successfully", () => {
    const mockResponse = {
      user: {
        email: "test@test.com",
        username: "test",
        token: "token",
        bio: "",
        image: "",
      },
    };
    userService.register.and.returnValue(of(mockResponse));
    router.navigate.and.returnValue(Promise.resolve(true));

    route.snapshot.url = [{ path: "register" }];
    component.ngOnInit();
    component.authForm.patchValue({
      email: "test@test.com",
      password: "password",
      username: "testuser",
    });

    component.submitForm();

    expect(component.isSubmitting).toBe(true);
    expect(userService.register).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "password",
      username: "testuser",
    });
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("should handle login error", () => {
    const errorResponse = { errors: { "email or password": ["is invalid"] } };
    userService.login.and.returnValue(throwError(() => errorResponse));

    component.ngOnInit();
    component.authForm.patchValue({
      email: "test@test.com",
      password: "wrongpassword",
    });

    component.submitForm();

    expect(component.errors).toEqual(errorResponse);
    expect(component.isSubmitting).toBe(false);
  });

  it("should handle register error", () => {
    const errorResponse = { errors: { email: ["has already been taken"] } };
    userService.register.and.returnValue(throwError(() => errorResponse));

    route.snapshot.url = [{ path: "register" }];
    component.ngOnInit();
    component.authForm.patchValue({
      email: "taken@test.com",
      password: "password",
      username: "testuser",
    });

    component.submitForm();

    expect(component.errors).toEqual(errorResponse);
    expect(component.isSubmitting).toBe(false);
  });

  it("should reset errors on form submission", () => {
    component.errors = { errors: { email: ["previous error"] } };
    userService.login.and.returnValue(
      of({ user: { email: "", username: "", token: "", bio: "", image: "" } }),
    );

    component.ngOnInit();
    component.submitForm();

    expect(component.errors).toEqual({ errors: {} });
  });
});
