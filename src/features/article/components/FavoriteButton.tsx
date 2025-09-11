import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Article } from "../../../types";
import { articlesService } from "../services/articles.service";
import { useAuth } from "../../../core/auth/useAuth";

interface FavoriteButtonProps {
  article: Article;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ article }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: () =>
      article.favorited
        ? articlesService.unfavoriteArticle(article.slug)
        : articlesService.favoriteArticle(article.slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", article.slug] });
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    favoriteMutation.mutate();
  };

  return (
    <button
      className={`btn btn-outline-primary btn-sm pull-xs-right ${
        article.favorited ? "active" : ""
      }`}
      onClick={handleClick}
      disabled={favoriteMutation.isPending}
    >
      <i className="ion-heart"></i> {article.favoritesCount}
    </button>
  );
};

export default FavoriteButton;
