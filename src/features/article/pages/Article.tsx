import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marked } from "marked";
import { articlesService } from "../services/articles.service";
import { useAuth } from "../../../core/auth/useAuth";
import ArticleMeta from "../components/ArticleMeta";

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => articlesService.getArticle(slug!),
    enabled: !!slug,
  });

  const deleteMutation = useMutation({
    mutationFn: () => articlesService.deleteArticle(slug!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/");
    },
  });

  if (isLoading) {
    return <div>Loading article...</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  const canModify = user ? user.username === article.author.username : false;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta
            article={article}
            canModify={canModify}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div
              dangerouslySetInnerHTML={{
                __html: marked(article.body),
              }}
            />
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleMeta
            article={article}
            canModify={canModify}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Article;
