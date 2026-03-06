import apiClient, { ApiError } from '../../lib/apiClient';
import type {
  ArticleResponse,
  CreateArticleRequest,
  ImageResponse,
  Language,
  PageType,
  UpdateArticleRequest,
} from './types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';
const ARTICLES = '/api/webcontent/articles';
const IMAGES = '/api/webcontent/images';

export const articleApi = {
  getAll: () => apiClient.get<ArticleResponse[]>(ARTICLES),

  getByPage: (page: PageType) =>
    apiClient.get<ArticleResponse[]>(`${ARTICLES}/page/${page}`),

  getPublishedByPage: (page: PageType, language?: Language) => {
    const url = language
      ? `${ARTICLES}/page/${page}/published?language=${language}`
      : `${ARTICLES}/page/${page}/published`;
    return apiClient.get<ArticleResponse[]>(url);
  },

  getById: (id: number) => apiClient.get<ArticleResponse>(`${ARTICLES}/${id}`),

  create: (data: CreateArticleRequest) =>
    apiClient.post<ArticleResponse>(ARTICLES, data),

  update: (id: number, data: UpdateArticleRequest) =>
    apiClient.put<ArticleResponse>(`${ARTICLES}/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`${ARTICLES}/${id}`),
};

export const imageApi = {
  getAll: () => apiClient.get<ImageResponse[]>(IMAGES),

  getDownloadUrl: (id: number) => `${BASE_URL}${IMAGES}/${id}/download`,

  upload: async (file: File): Promise<ImageResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}${IMAGES}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const message = await response.text().catch(() => response.statusText);
      throw new ApiError(response.status, message);
    }

    return response.json() as Promise<ImageResponse>;
  },

  delete: (id: number) => apiClient.delete<void>(`${IMAGES}/${id}`),
};
