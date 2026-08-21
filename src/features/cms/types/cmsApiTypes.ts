/**
 * @fileoverview API types for System Content (CMS) domain.
 * Mirrors the GET and PUT /admin/content/:key schemas from Admin.postman_collection (3).json.
 *
 * GET /admin/content/:key → response: { key, title, content, createdAt, updatedAt }
 * PUT /admin/content/:key → body: { title, content } → response: { key, title, content }
 * Valid keys: 'privacy_policy' | 'terms_conditions' | 'about'
 */

/** Valid content keys as defined by the backend API. */
export type CMSContentType = 'about' | 'privacy_policy' | 'terms_conditions';

/** Shape returned by GET /admin/content/:key and PUT /admin/content/:key. */
export interface CMSContentResponse {
  key: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Body sent on PUT /admin/content/:key — must include both title and content. */
export interface UpdateCMSContentRequest {
  /** Path variable: the content key to update. */
  type: CMSContentType;
  /** Page title displayed in the mobile app. */
  title: string;
  /** Page body content (JSON-serialized CMSBlock[] from the editor). */
  content: string;
}

export interface CMSApiResponse<T> {
  statusCode: number;
  message: string;
  response: T;
}
