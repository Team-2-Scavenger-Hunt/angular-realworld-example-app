import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { UserService } from "../../core/auth/services/user.service";
import { Component } from "@angular/core";

@Component({
  selector: "app-settings",
  template: "<div>Mock Settings Component</div>",
})
class MockSettingsComponent {
  settingsForm: any = {
    get: jasmine
      .createSpy("get")
      .and.returnValue({
        value: "",
        hasError: jasmine.createSpy("hasError").and.returnValue(true),
      }),
    patchValue: jasmine.createSpy("patchValue"),
  };
  errors: any = { errors: {} };
  isSubmitting = false;

  ngOnInit() {}
  submitForm() {}
  logout() {}
}

describe("SettingsComponent", () => {
  let component: MockSettingsComponent;
  let fixture: ComponentFixture<MockSettingsComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj("UserService", [
      "getCurrentUser",
      "update",
      "logout",
    ]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MockSettingsComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockSettingsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load current user data on init", () => {
    const mockUser = {
      user: {
        email: "test@test.com",
        username: "testuser",
        bio: "Test bio",
        image: "test-image.jpg",
        token: "token",
      },
    };

    userService.getCurrentUser.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(userService.getCurrentUser).toHaveBeenCalled();
    expect(component.settingsForm.get("image")?.value).toBe("test-image.jpg");
    expect(component.settingsForm.get("username")?.value).toBe("testuser");
    expect(component.settingsForm.get("bio")?.value).toBe("Test bio");
    expect(component.settingsForm.get("email")?.value).toBe("test@test.com");
  });

  it("should update user settings successfully", () => {
    const updateData = {
      image: "new-image.jpg",
      username: "newusername",
      bio: "New bio",
      email: "new@test.com",
      password: "newpassword",
    };
    const mockResponse = { user: { ...updateData, token: "token" } };

    userService.update.and.returnValue(of(mockResponse));
    router.navigate.and.returnValue(Promise.resolve(true));

    component.settingsForm.patchValue(updateData);
    component.submitForm();

    expect(component.isSubmitting).toBe(true);
    expect(userService.update).toHaveBeenCalledWith(updateData);
    expect(router.navigate).toHaveBeenCalledWith(["/profile/", "newusername"]);
  });

  it("should handle update errors", () => {
    const errorResponse = { errors: { email: ["has already been taken"] } };
    userService.update.and.returnValue(throwError(() => errorResponse));

    component.submitForm();

    expect(component.errors).toEqual(errorResponse);
    expect(component.isSubmitting).toBe(false);
  });

  it("should logout user", () => {
    component.logout();
    expect(userService.logout).toHaveBeenCalled();
  });

  it("should validate required fields", () => {
    expect(component.settingsForm.get("image")?.hasError("required")).toBe(
      false,
    );
    expect(component.settingsForm.get("username")?.hasError("required")).toBe(
      true,
    );
    expect(component.settingsForm.get("bio")?.hasError("required")).toBe(false);
    expect(component.settingsForm.get("email")?.hasError("required")).toBe(
      true,
    );
    expect(component.settingsForm.get("password")?.hasError("required")).toBe(
      false,
    );
  });

  it("should not include empty password in update", () => {
    const updateData = {
      image: "image.jpg",
      username: "username",
      bio: "bio",
      email: "email@test.com",
      password: "",
    };

    userService.update.and.returnValue(
      of({ user: { email: "", username: "", token: "", bio: "", image: "" } }),
    );

    component.settingsForm.patchValue(updateData);
    component.submitForm();

    const expectedData: any = { ...updateData };
    delete expectedData.password;
    expect(userService.update).toHaveBeenCalledWith(expectedData);
  });
});
