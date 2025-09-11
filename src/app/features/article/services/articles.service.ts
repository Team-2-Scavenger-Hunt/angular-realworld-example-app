import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArticleListConfig } from "../models/article-list-config.model";
import { Article } from "../models/article.model";
import { HttpService } from "../../../core/http/http.service";

@Injectable({ providedIn: "root" })
export class ArticlesService {
  constructor(private readonly http: HttpService) {}

  query(
    config: ArticleListConfig,
  ): Observable<{ articles: Article[]; articlesCount: number }> {
    // Convert filters to plain object for Axios params
    const params: any = {};

    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params[key] = config.filters[key];
    });

    return this.http.get<{ articles: Article[]; articlesCount: number }>(
      "/articles" + (config.type === "feed" ? "/feed" : ""),
      params,
    );
  }

  get(slug: string): Observable<Article> {
    return this.http
      .get<{ article: Article }>(`/articles/${slug}`)
      .pipe(map((data) => data.article));
  }

  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}`);
  }

  create(article: Partial<Article>): Observable<Article> {
    return this.http
      .post<{ article: Article }>("/articles/", { article: article })
      .pipe(map((data) => data.article));
  }

  update(article: Partial<Article>): Observable<Article> {
    return this.http
      .put<{ article: Article }>(`/articles/${article.slug}`, {
        article: article,
      })
      .pipe(map((data) => data.article));
  }

  favorite(slug: string): Observable<Article> {
    return this.http
      .post<{ article: Article }>(`/articles/${slug}/favorite`, {})
      .pipe(map((data) => data.article));
  }

  unfavorite(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}/favorite`);
  }
}
