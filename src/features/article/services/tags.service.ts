import { api } from "../../../core/http/api";

class TagsService {
  async getTags(): Promise<string[]> {
    const response = await api.get<{ tags: string[] }>("/tags");
    return response.data.tags;
  }
}

export const tagsService = new TagsService();
