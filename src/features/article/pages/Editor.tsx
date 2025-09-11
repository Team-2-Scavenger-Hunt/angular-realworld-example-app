import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { articlesService } from "../services/articles.service";
import { Errors } from "../../../types";
import ListErrors from "../../../shared/components/ListErrors";

const Editor: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditing = !!slug;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    body: "",
    tagList: "",
  });
  const [errors, setErrors] = useState<Errors>({ errors: {} });

  const { data: article } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => articlesService.getArticle(slug!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList.join(", "),
      });
    }
  }, [article]);

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      body: string;
      tagList: string[];
    }) => articlesService.createArticle(data),
    onSuccess: (article) => {
      navigate(`/article/${article.slug}`);
    },
    onError: (error: unknown) => {
      setErrors(
        (error as Errors) || { errors: { "": ["Something went wrong"] } },
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      body: string;
      tagList: string[];
    }) => articlesService.updateArticle(slug!, data),
    onSuccess: (article) => {
      navigate(`/article/${article.slug}`);
    },
    onError: (error: unknown) => {
      setErrors(
        (error as Errors) || { errors: { "": ["Something went wrong"] } },
      );
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ errors: {} });

    const articleData = {
      title: formData.title,
      description: formData.description,
      body: formData.body,
      tagList: formData.tagList
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    if (isEditing) {
      updateMutation.mutate(articleData);
    } else {
      createMutation.mutate(articleData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ListErrors errors={errors} />

            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="title"
                    placeholder="Article Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    placeholder="What's this article about?"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    name="body"
                    placeholder="Write your article (in markdown)"
                    value={formData.body}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="tagList"
                    placeholder="Enter tags (comma separated)"
                    value={formData.tagList}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isEditing ? "Update Article" : "Publish Article"}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
