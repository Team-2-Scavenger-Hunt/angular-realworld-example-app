import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { useAuth } from "../../../core/auth/useAuth";
import FollowButton from "../components/FollowButton";
import ArticleList from "../../article/components/ArticleList";
import { ArticleListConfig } from "../../../types";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const { user } = useAuth();

  const isFavoritesTab = location.pathname.includes("/favorites");
  const isCurrentUser = user?.username === username;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => profileService.getProfile(username!),
    enabled: !!username,
  });

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const getArticleConfig = (): ArticleListConfig => {
    if (isFavoritesTab) {
      return { type: "favorited", filters: { favorited: username! } };
    }
    return { type: "author", filters: { author: username! } };
  };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} className="user-img" alt="" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {!isCurrentUser && <FollowButton profile={profile} />}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a
                    className={`nav-link ${!isFavoritesTab ? "active" : ""}`}
                    href={`/profile/${username}`}
                  >
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${isFavoritesTab ? "active" : ""}`}
                    href={`/profile/${username}/favorites`}
                  >
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            <ArticleList config={getArticleConfig()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
