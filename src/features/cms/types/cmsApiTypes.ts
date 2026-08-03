/**
 * @fileoverview API types for System Content (CMS) domain.
 * Mirrors the GET and PUT /admin/content/:type schemas from Admin.postman_collection (1).json.
 */

export type CMSContentType = 'about' | 'privacy_policy' | 'terms_conditions' | 'privacy' | 'terms' | 'faq';

export interface CMSContentResponse {
  id?: number;
  type?: string;
  content: string;
  updatedAt?: string;
}

export interface UpdateCMSContentRequest {
  type: CMSContentType;
  content: string;
}

export interface CMSApiResponse<T> {
  statusCode: number;
  message: string;
  response: T;
}
