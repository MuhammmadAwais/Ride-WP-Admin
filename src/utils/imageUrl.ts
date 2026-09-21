import { API_BASE_URL } from '../api/baseQuery';

/**
 * Resolves a profile image, logo, or media asset path from the backend API to an absolute URL.
 * 
 * Handles:
 * - Full HTTP/HTTPS URLs (returns as-is)
 * - Data URIs and Blob URLs (returns as-is)
 * - Relative backend filenames like "saqi.png", "profile.jpg"
 * - Explicit backend paths starting with /public/ or /uploads/
 * - Configurable environment override via VITE_IMAGE_BASE_URL or VITE_STORAGE_BASE_URL
 */
export function getImageUrl(path?: string | null): string {
  if (!path || typeof path !== 'string' || !path.trim() || path === 'null' || path === 'undefined') {
    return '';
  }

  const trimmed = path.trim();

  // Already an absolute URL, data URI, or blob URL
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Derive the server origin (e.g., https://api.ridewithpals.com) from API_BASE_URL
  const origin = API_BASE_URL.replace(/\/api\/?$/, '');

  // Check if an explicit environment variable override is configured
  const envBase = import.meta.env.VITE_IMAGE_BASE_URL || import.meta.env.VITE_STORAGE_BASE_URL;
  if (envBase) {
    const cleanEnvBase = envBase.replace(/\/$/, '');
    const cleanPath = trimmed.replace(/^\//, '');
    return `${cleanEnvBase}/${cleanPath}`;
  }

  // If path already explicitly specifies a root static folder like /public/ or /uploads/
  if (trimmed.startsWith('/public/') || trimmed.startsWith('/uploads/')) {
    return `${origin}${trimmed}`;
  }

  if (trimmed.startsWith('public/') || trimmed.startsWith('uploads/')) {
    return `${origin}/${trimmed}`;
  }

  // If path starts with a leading slash
  if (trimmed.startsWith('/')) {
    return `${origin}${trimmed}`;
  }

  // By default in Ride-WP backend, user uploads and avatars are hosted under /uploads/
  return `${origin}/uploads/${trimmed}`;
}
