import { api } from "../../../core/http/api";
import { Article, ArticleListConfig } from "../../../types";

class ArticlesService {
  async getArticles(config: ArticleListConfig) {
    const params = new URLSearchParams();

    if (config.filters.limit)
      params.append("limit", config.filters.limit.toString());
    if (config.filters.offset)
      params.append("offset", config.filters.offset.toString());
    if (config.filters.tag) params.append("tag", config.filters.tag);
    if (config.filters.author) params.append("author", config.filters.author);
    if (config.filters.favorited)
      params.append("favorited", config.filters.favorited);

    const endpoint = config.type === "feed" ? "/articles/feed" : "/articles";
    const response = await api.get(`${endpoint}?${params}`);
    return response.data;
  }

  async getArticle(slug: string) {
    const response = await api.get<{ article: Article }>(`/articles/${slug}`);
    return response.data.article;
  }

  async createArticle(article: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  }) {
    const response = await api.post<{ article: Article }>("/articles", {
      article,
    });
    return response.data.article;
  }

  async updateArticle(
    slug: string,
    article: {
      title: string;
      description: string;
      body: string;
      tagList: string[];
    },
  ) {
    const response = await api.put<{ article: Article }>(`/articles/${slug}`, {
      article,
    });
    return response.data.article;
  }

  async deleteArticle(slug: string) {
    await api.delete(`/articles/${slug}`);
  }

  async favoriteArticle(slug: string) {
    const response = await api.post<{ article: Article }>(
      `/articles/${slug}/favorite`,
    );
    return response.data.article;
  }

  async unfavoriteArticle(slug: string) {
    const response = await api.delete<{ article: Article }>(
      `/articles/${slug}/favorite`,
    );
    return response.data.article;
  }
}

export const articlesService = new ArticlesService();
