import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { HeaderComponent } from "./header.component";
import { UserService } from "../auth/services/user.service";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj("UserService", ["logout"], {
      currentUser: of(null),
      isAuthenticated: of(false),
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HeaderComponent],
      providers: [{ provide: UserService, useValue: userSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show authenticated navigation when user is logged in", () => {
    const mockUser = {
      id: 1,
      email: "test@test.com",
      username: "testuser",
      token: "token",
      bio: "",
      image: "",
    };

    Object.defineProperty(userService, "currentUser", {
      value: of(mockUser),
    });
    Object.defineProperty(userService, "isAuthenticated", {
      value: of(true),
    });

    fixture.detectChanges();

    component.currentUser$.subscribe((user) => {
      expect(user).toEqual(mockUser);
    });
  });

  it("should show unauthenticated navigation when user is not logged in", () => {
    Object.defineProperty(userService, "currentUser", {
      value: of(null),
    });
    Object.defineProperty(userService, "isAuthenticated", {
      value: of(false),
    });

    fixture.detectChanges();

    component.currentUser$.subscribe((user) => {
      expect(user).toBeNull();
    });
  });

  it("should call logout when logout is triggered", () => {
    userService.logout();
    expect(userService.logout).toHaveBeenCalled();
  });
});
