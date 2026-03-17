export type ArticleState = 'CREATED' | 'PUBLISHED' | 'CLOSED';
export type PageType = 'HOME_TEASER' | 'HOME_PAGE' | 'NEWS_TEASER' | 'NEWS_PAGE' | 'ABOUT_TEASER' | 'ABOUT_PAGE';
export type Language = 'GERMAN' | 'ENGLISH' | 'SWEDISH' | 'RUSSIAN';

export interface ImageResponse {
  id: number;
  fileName: string;
  title: string;
  mimeType: string;
  createdAt: string;
}

export interface TagResponse {
  id: number;
  name: string;
}

export interface ArticleResponse {
  id: number;
  title: string;
  content: string;
  state: ArticleState;
  page: PageType;
  language: Language;
  publishedDate: string | null;
  images: ImageResponse[];
  tags: TagResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  page: PageType;
  language: Language;
  imageIds: number[];
  tagIds: number[];
}

export interface UpdateArticleRequest {
  title: string;
  content: string;
  state: ArticleState;
  language: Language;
  imageIds: number[];
  tagIds: number[];
}

export interface UpdateImageRequest {
  title: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
}
