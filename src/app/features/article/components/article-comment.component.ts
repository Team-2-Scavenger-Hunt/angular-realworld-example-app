import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { UserService } from "../../../core/auth/services/user.service";
import { User } from "../../../core/auth/user.model";
import { RouterLink } from "@angular/router";
import { map } from "rxjs/operators";
import { Comment } from "../models/comment.model";
import { AsyncPipe, DatePipe } from "@angular/common";

@Component({
  selector: "app-article-comment",
  template: `
    @if (comment) {
      <div class="card comment-card">
        <div class="card-block">
          <p class="card-text">
            {{ comment.body }}
          </p>
        </div>
        <div class="card-footer">
          <div class="comment-author-info">
            <a
              class="comment-author interactive-link"
              [routerLink]="['/profile', comment.author.username]"
            >
              <img
                [src]="comment.author.image"
                class="comment-author-img"
                alt="{{ comment.author.username }}"
              />
            </a>
            <div class="comment-meta">
              <a
                class="comment-author-name interactive-link"
                [routerLink]="['/profile', comment.author.username]"
              >
                {{ comment.author.username }}
              </a>
              <span class="date-posted">
                {{ comment.createdAt | date: "longDate" }}
              </span>
            </div>
          </div>
          @if (canModify$ | async) {
            <span class="mod-options">
              <i
                class="ion-trash-a delete-comment-btn"
                (click)="delete.emit(true)"
                title="Delete comment"
                tabindex="0"
                (keydown.enter)="delete.emit(true)"
                (keydown.space)="delete.emit(true)"
              ></i>
            </span>
          }
        </div>
      </div>
    }
  `,
  imports: [RouterLink, DatePipe, AsyncPipe],
  styles: [
    `
      .comment-card {
        margin-bottom: 1rem;
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
      }

      .comment-author-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .comment-meta {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .comment-author-name {
        font-weight: 500;
        color: #5cb85c;
        text-decoration: none;
      }

      .date-posted {
        font-size: 0.875rem;
        color: #6c757d;
      }

      .delete-comment-btn {
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.2s ease-in-out;
        color: #6c757d;
      }

      .delete-comment-btn:hover,
      .delete-comment-btn:focus {
        background-color: #dc3545;
        color: white;
        transform: scale(1.1);
        outline: none;
      }

      @media (max-width: 576px) {
        .card-footer {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .comment-author-info {
          width: 100%;
        }

        .mod-options {
          align-self: flex-end;
        }
      }
    `,
  ],
})
export class ArticleCommentComponent {
  @Input() comment!: Comment;
  @Output() delete = new EventEmitter<boolean>();

  canModify$ = inject(UserService).currentUser.pipe(
    map(
      (userData: User | null) =>
        userData?.username === this.comment.author.username,
    ),
  );
}
