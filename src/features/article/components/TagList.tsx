import React from "react";
import { useQuery } from "@tanstack/react-query";
import { tagsService } from "../services/tags.service";

interface TagListProps {
  onTagClick: (tag: string) => void;
}

const TagList: React.FC<TagListProps> = ({ onTagClick }) => {
  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsService.getTags,
  });

  if (isLoading) {
    return <div>Loading tags...</div>;
  }

  return (
    <div className="tag-list">
      {tags?.map((tag: string) => (
        <button
          key={tag}
          className="tag-pill tag-default"
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagList;
