import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CommentsService } from "./comments.service";
import { Comment } from "../models/comment.model";

describe("CommentsService", () => {
  let service: CommentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentsService],
    });
    service = TestBed.inject(CommentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get all comments for article", () => {
    const mockComments: Comment[] = [
      {
        id: "1",
        body: "Test comment",
        createdAt: "2023-01-01",
        author: {
          username: "testuser",
          bio: "",
          image: "",
          following: false,
        },
      },
    ];

    service.getAll("test-article").subscribe((comments) => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne("/articles/test-article/comments");
    expect(req.request.method).toBe("GET");
    req.flush({ comments: mockComments });
  });

  it("should add comment to article", () => {
    const newComment = { body: "New comment" };
    const mockComment: Comment = {
      id: "1",
      body: "New comment",
      createdAt: "2023-01-01",
      author: {
        username: "testuser",
        bio: "",
        image: "",
        following: false,
      },
    };

    service.add("test-article", newComment.body).subscribe((comment) => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne("/articles/test-article/comments");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ comment: { body: newComment.body } });
    req.flush({ comment: mockComment });
  });

  it("should delete comment", () => {
    service.delete("test-article", "1").subscribe();

    const req = httpMock.expectOne("/articles/test-article/comments/1");
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });
});
