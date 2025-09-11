import React from "react";
import { Link } from "react-router-dom";
import { Article } from "../../../types";
import FavoriteButton from "./FavoriteButton";
import FollowButton from "../../profile/components/FollowButton";

interface ArticleMetaProps {
  article: Article;
  canModify?: boolean;
  onDelete?: () => void;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({
  article,
  canModify,
  onDelete,
}) => {
  return (
    <div className="article-meta">
      <Link to={`/profile/${article.author.username}`}>
        <img src={article.author.image} alt="" />
      </Link>
      <div className="info">
        <Link to={`/profile/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">
          {new Date(article.createdAt).toDateString()}
        </span>
      </div>

      {canModify ? (
        <>
          <Link
            to={`/editor/${article.slug}`}
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="ion-edit"></i> Edit Article
          </Link>
          <button className="btn btn-outline-danger btn-sm" onClick={onDelete}>
            <i className="ion-trash-a"></i> Delete Article
          </button>
        </>
      ) : (
        <>
          <FollowButton profile={article.author} />
          <FavoriteButton article={article} />
        </>
      )}
    </div>
  );
};

export default ArticleMeta;
