import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { IfAuthenticatedDirective } from "./if-authenticated.directive";
import { UserService } from "./services/user.service";

@Component({
  template: `
    <div *appIfAuthenticated>Authenticated content</div>
    <div *appIfAuthenticated="false">Unauthenticated content</div>
  `,
})
class TestComponent {}

describe("IfAuthenticatedDirective", () => {
  let fixture: ComponentFixture<TestComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj("UserService", [], {
      isAuthenticated: of(false),
    });

    await TestBed.configureTestingModule({
      declarations: [TestComponent, IfAuthenticatedDirective],
      providers: [{ provide: UserService, useValue: userSpy }],
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it("should show content when authenticated and condition is true", () => {
    Object.defineProperty(userService, "isAuthenticated", {
      value: of(true),
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain("Authenticated content");
  });

  it("should hide content when not authenticated and condition is true", () => {
    Object.defineProperty(userService, "isAuthenticated", {
      value: of(false),
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).not.toContain("Authenticated content");
  });

  it("should show content when not authenticated and condition is false", () => {
    Object.defineProperty(userService, "isAuthenticated", {
      value: of(false),
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const compiledElement = fixture.nativeElement;
    expect(compiledElement.textContent).toContain("Unauthenticated content");
  });

  it("should hide content when authenticated and condition is false", () => {
    Object.defineProperty(userService, "isAuthenticated", {
      value: of(true),
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const compiledElement = fixture.nativeElement;
    expect(compiledElement.textContent).not.toContain(
      "Unauthenticated content",
    );
  });

  it("should react to authentication state changes", () => {
    const authSubject = of(false);
    Object.defineProperty(userService, "isAuthenticated", {
      value: authSubject,
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    let compiledElement = fixture.nativeElement;
    expect(compiledElement.textContent).not.toContain("Authenticated content");

    Object.defineProperty(userService, "isAuthenticated", {
      value: of(true),
    });
    fixture.detectChanges();

    compiledElement = fixture.nativeElement;
    expect(compiledElement.textContent).toContain("Authenticated content");
  });
});
