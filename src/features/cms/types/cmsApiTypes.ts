/**
 * @fileoverview API types for System Content (CMS) domain.
 * Mirrors GET /admin/content/:key, PUT /admin/content/:key, and GET /public/content/:key
 * schemas from Admin.postman_collection.json.
 */

/** Valid content keys as defined by the backend API. */
export type CMSContentType = 'privacy_policy' | 'terms_conditions' | 'about' | string;

/** Supported localizations for CMS documents. */
export type CMSLanguage = 'en' | 'es';

/** Shape returned by GET /admin/content/:key, GET /public/content/:key and PUT /admin/content/:key. */
export interface CMSContentResponse {
  key: string;
  title: string;
  content: string;
  titleEs?: string;
  contentEs?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Body sent on PUT /admin/content/:key with dual language support. */
export interface UpdateCMSContentRequest {
  /** Path variable: the content key to update. */
  type: CMSContentType;
  /** Primary English page title. */
  title: string;
  /** Primary English page body content (serialized blocks or markdown). */
  content: string;
  /** Optional Spanish page title for bilingual localization. */
  titleEs?: string;
  /** Optional Spanish page body content for bilingual localization. */
  contentEs?: string;
  /** Header: language ('en' or 'es') */
  language?: CMSLanguage;
}

export interface CMSApiResponse<T> {
  statusCode: number;
  message: string;
  response: T;
}
