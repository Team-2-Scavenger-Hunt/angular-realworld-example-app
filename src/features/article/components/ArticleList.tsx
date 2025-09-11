import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArticleListConfig, Article } from "../../../types";
import { articlesService } from "../services/articles.service";
import ArticlePreview from "./ArticlePreview";

interface ArticleListProps {
  config: ArticleListConfig;
}

const ArticleList: React.FC<ArticleListProps> = ({ config }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles", config],
    queryFn: () => articlesService.getArticles(config),
  });

  if (isLoading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (error) {
    return <div className="article-preview">Error loading articles</div>;
  }

  if (!data?.articles.length) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <div>
      {data.articles.map((article: Article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;
