import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ArticlesService } from "./articles.service";
import { Article } from "../models/article.model";
import { ArticleListConfig } from "../models/article-list-config.model";

describe("ArticlesService", () => {
  let service: ArticlesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticlesService],
    });
    service = TestBed.inject(ArticlesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should query articles with filters", () => {
    const config: ArticleListConfig = {
      type: "all",
      filters: { tag: "angular", limit: 10, offset: 0 },
    };
    const mockResponse = { articles: [], articlesCount: 0 };

    service.query(config).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((req) => req.url === "/articles");
    expect(req.request.method).toBe("GET");
    expect(req.request.params.get("tag")).toBe("angular");
    expect(req.request.params.get("limit")).toBe("10");
    expect(req.request.params.get("offset")).toBe("0");
    req.flush(mockResponse);
  });

  it("should query feed articles", () => {
    const config: ArticleListConfig = {
      type: "feed",
      filters: { limit: 20, offset: 0 },
    };
    const mockResponse = { articles: [], articlesCount: 0 };

    service.query(config).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((req) => req.url === "/articles/feed");
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should get single article by slug", () => {
    const mockArticle: Article = {
      slug: "test-article",
      title: "Test Article",
      description: "Test description",
      body: "Test body",
      tagList: ["test"],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "testuser",
        bio: "",
        image: "",
        following: false,
      },
    };

    service.get("test-article").subscribe((article) => {
      expect(article).toEqual(mockArticle);
    });

    const req = httpMock.expectOne("/articles/test-article");
    expect(req.request.method).toBe("GET");
    req.flush({ article: mockArticle });
  });

  it("should delete article by slug", () => {
    service.delete("test-article").subscribe();

    const req = httpMock.expectOne("/articles/test-article");
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });

  it("should create new article", () => {
    const newArticle = {
      title: "New Article",
      description: "New description",
      body: "New body",
      tagList: ["new"],
    };
    const mockResponse: Article = {
      slug: "new-article",
      title: "New Article",
      description: "New description",
      body: "New body",
      tagList: ["new"],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "testuser",
        bio: "",
        image: "",
        following: false,
      },
    };

    service.create(newArticle).subscribe((article) => {
      expect(article).toEqual(mockResponse);
    });

    const req = httpMock.expectOne("/articles/");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ article: newArticle });
    req.flush({ article: mockResponse });
  });

  it("should update existing article", () => {
    const updateData = {
      slug: "test-article",
      title: "Updated Article",
      description: "Updated description",
      body: "Updated body",
    };
    const mockResponse: Article = {
      slug: "test-article",
      title: "Updated Article",
      description: "Updated description",
      body: "Updated body",
      tagList: ["test"],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-02",
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "testuser",
        bio: "",
        image: "",
        following: false,
      },
    };

    service.update(updateData).subscribe((article) => {
      expect(article).toEqual(mockResponse);
    });

    const req = httpMock.expectOne("/articles/test-article");
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual({ article: updateData });
    req.flush({ article: mockResponse });
  });

  it("should favorite article", () => {
    const mockResponse: Article = {
      slug: "test-article",
      title: "Test Article",
      description: "Test description",
      body: "Test body",
      tagList: ["test"],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      favorited: true,
      favoritesCount: 1,
      author: {
        username: "testuser",
        bio: "",
        image: "",
        following: false,
      },
    };

    service.favorite("test-article").subscribe((article) => {
      expect(article).toEqual(mockResponse);
    });

    const req = httpMock.expectOne("/articles/test-article/favorite");
    expect(req.request.method).toBe("POST");
    req.flush({ article: mockResponse });
  });

  it("should unfavorite article", () => {
    service.unfavorite("test-article").subscribe();

    const req = httpMock.expectOne("/articles/test-article/favorite");
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });
});
