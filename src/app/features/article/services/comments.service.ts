import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Comment } from "../models/comment.model";
import { HttpService } from "../../../core/http/http.service";

@Injectable({ providedIn: "root" })
export class CommentsService {
  constructor(private readonly http: HttpService) {}

  getAll(slug: string): Observable<Comment[]> {
    return this.http
      .get<{ comments: Comment[] }>(`/articles/${slug}/comments`)
      .pipe(map((data) => data.comments));
  }

  add(slug: string, payload: string): Observable<Comment> {
    return this.http
      .post<{ comment: Comment }>(`/articles/${slug}/comments`, {
        comment: { body: payload },
      })
      .pipe(map((data) => data.comment));
  }

  delete(commentId: string, slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}/comments/${commentId}`);
  }
}
