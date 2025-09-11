import React, { useState } from "react";
import { useAuth } from "../../../core/auth/useAuth";
import ArticleList from "../components/ArticleList";
import TagList from "../components/TagList";
import { ArticleListConfig } from "../../../types";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"feed" | "global" | "tag">(
    "global",
  );
  const [selectedTag, setSelectedTag] = useState<string>("");

  const getArticleConfig = (): ArticleListConfig => {
    switch (activeTab) {
      case "feed":
        return { type: "feed", filters: {} };
      case "tag":
        return { type: "tag", filters: { tag: selectedTag } };
      default:
        return { type: "all", filters: {} };
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab("tag");
  };

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {isAuthenticated && (
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "feed" ? "active" : ""}`}
                      onClick={() => setActiveTab("feed")}
                    >
                      Your Feed
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "global" ? "active" : ""}`}
                    onClick={() => setActiveTab("global")}
                  >
                    Global Feed
                  </button>
                </li>
                {activeTab === "tag" && (
                  <li className="nav-item">
                    <span className="nav-link active">
                      <i className="ion-pound"></i> {selectedTag}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            <ArticleList config={getArticleConfig()} />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <TagList onTagClick={handleTagClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
