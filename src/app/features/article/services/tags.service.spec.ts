import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TagsService } from "./tags.service";

describe("TagsService", () => {
  let service: TagsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TagsService],
    });
    service = TestBed.inject(TagsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get all tags", () => {
    const mockTags = ["angular", "typescript", "javascript", "web"];

    service.getAll().subscribe((tags) => {
      expect(tags).toEqual(mockTags);
    });

    const req = httpMock.expectOne("/tags");
    expect(req.request.method).toBe("GET");
    req.flush({ tags: mockTags });
  });

  it("should handle empty tags response", () => {
    service.getAll().subscribe((tags) => {
      expect(tags).toEqual([]);
    });

    const req = httpMock.expectOne("/tags");
    req.flush({ tags: [] });
  });

  it("should handle tags service error", () => {
    service.getAll().subscribe({
      next: () => fail("should have failed"),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne("/tags");
    req.error(new ErrorEvent("Network error"));
  });
});
