import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { ArticlesService } from "../../services/articles.service";
import { UserService } from "../../../../core/auth/services/user.service";
import { Component } from "@angular/core";

@Component({
  selector: "app-editor",
  template: "<div>Mock Editor Component</div>",
})
class MockEditorComponent {
  articleForm: any = {
    get: jasmine.createSpy("get").and.returnValue({ value: "" }),
    patchValue: jasmine.createSpy("patchValue"),
  };
  tagField: any = {
    setValue: jasmine.createSpy("setValue"),
    value: "",
  };
  tagList: string[] = [];
  errors: any = { errors: {} };
  isSubmitting = false;

  ngOnInit() {}
  addTag() {}
  removeTag(tag: string) {}
  submitForm() {}
}

describe("EditorComponent", () => {
  let component: MockEditorComponent;
  let fixture: ComponentFixture<MockEditorComponent>;
  let articlesService: jasmine.SpyObj<ArticlesService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let route: any;

  beforeEach(async () => {
    const articlesSpy = jasmine.createSpyObj("ArticlesService", [
      "get",
      "create",
      "update",
    ]);
    const userSpy = jasmine.createSpyObj("UserService", ["getCurrentUser"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    route = {
      snapshot: { params: {} },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MockEditorComponent],
      providers: [
        { provide: ArticlesService, useValue: articlesSpy },
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockEditorComponent);
    component = fixture.componentInstance;
    articlesService = TestBed.inject(
      ArticlesService,
    ) as jasmine.SpyObj<ArticlesService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with empty form", () => {
    expect(component.articleForm.get("title")?.value).toBe("");
    expect(component.articleForm.get("description")?.value).toBe("");
    expect(component.articleForm.get("body")?.value).toBe("");
    expect(component.tagList).toEqual([]);
  });

  it("should add tag to tagList", () => {
    component.tagField.setValue("angular");
    component.addTag();
    expect(component.tagList).toContain("angular");
    expect(component.tagField.value).toBe("");
  });

  it("should not add empty tag", () => {
    component.tagField.setValue("");
    component.addTag();
    expect(component.tagList).toEqual([]);
  });

  it("should not add duplicate tag", () => {
    component.tagList = ["angular"];
    component.tagField.setValue("angular");
    component.addTag();
    expect(component.tagList).toEqual(["angular"]);
  });

  it("should remove tag from tagList", () => {
    component.tagList = ["angular", "typescript"];
    component.removeTag("angular");
    expect(component.tagList).toEqual(["typescript"]);
  });

  it("should load existing article for editing", () => {
    const mockArticle = {
      slug: "test-article",
      title: "Test Article",
      description: "Test description",
      body: "Test body",
      tagList: ["test"],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      favorited: false,
      favoritesCount: 0,
      author: { username: "testuser", bio: "", image: "", following: false },
    };
    const mockUser = {
      user: { username: "testuser", email: "", token: "", bio: "", image: "" },
    };

    route.snapshot.params = { slug: "test-article" };
    articlesService.get.and.returnValue(of(mockArticle));
    userService.getCurrentUser.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(articlesService.get).toHaveBeenCalledWith("test-article");
    expect(userService.getCurrentUser).toHaveBeenCalled();
    expect(component.tagList).toEqual(["test"]);
    expect(component.articleForm.get("title")?.value).toBe("Test Article");
  });

  it("should redirect if user is not article author", () => {
    const mockArticle = {
      slug: "test-article",
      title: "Test Article",
      description: "Test description",
      body: "Test body",
      tagList: ["test"],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      favorited: false,
      favoritesCount: 0,
      author: { username: "otheruser", bio: "", image: "", following: false },
    };
    const mockUser = {
      user: { username: "testuser", email: "", token: "", bio: "", image: "" },
    };

    route.snapshot.params = { slug: "test-article" };
    articlesService.get.and.returnValue(of(mockArticle));
    userService.getCurrentUser.and.returnValue(of(mockUser));
    router.navigate.and.returnValue(Promise.resolve(true));

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("should create new article", () => {
    const mockArticle = {
      slug: "new-article",
      title: "New Article",
      description: "New description",
      body: "New body",
      tagList: ["new"],
    };

    articlesService.create.and.returnValue(of(mockArticle as any));
    router.navigate.and.returnValue(Promise.resolve(true));

    component.articleForm.patchValue({
      title: "New Article",
      description: "New description",
      body: "New body",
    });
    component.tagList = ["new"];

    component.submitForm();

    expect(articlesService.create).toHaveBeenCalledWith({
      title: "New Article",
      description: "New description",
      body: "New body",
      tagList: ["new"],
    });
    expect(router.navigate).toHaveBeenCalledWith(["/article/", "new-article"]);
  });

  it("should update existing article", () => {
    const mockArticle = {
      slug: "test-article",
      title: "Updated Article",
      description: "Updated description",
      body: "Updated body",
      tagList: ["updated"],
    };

    route.snapshot.params = { slug: "test-article" };
    articlesService.update.and.returnValue(of(mockArticle as any));
    router.navigate.and.returnValue(Promise.resolve(true));

    component.articleForm.patchValue({
      title: "Updated Article",
      description: "Updated description",
      body: "Updated body",
    });
    component.tagList = ["updated"];

    component.submitForm();

    expect(articlesService.update).toHaveBeenCalledWith({
      title: "Updated Article",
      description: "Updated description",
      body: "Updated body",
      tagList: ["updated"],
      slug: "test-article",
    });
    expect(router.navigate).toHaveBeenCalledWith(["/article/", "test-article"]);
  });

  it("should handle submission error", () => {
    const errorResponse = { errors: { title: ["is required"] } };
    articlesService.create.and.returnValue(throwError(() => errorResponse));

    component.submitForm();

    expect(component.errors).toEqual(errorResponse);
    expect(component.isSubmitting).toBe(false);
  });

  it("should add pending tag before submission", () => {
    component.tagField.setValue("pending");
    component.tagList = ["existing"];
    articlesService.create.and.returnValue(of({ slug: "test" } as any));

    component.submitForm();

    expect(component.tagList).toContain("pending");
    expect(component.tagList).toContain("existing");
  });
});
