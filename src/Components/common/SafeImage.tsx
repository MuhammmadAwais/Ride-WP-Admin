import React, { useState } from 'react';
import { getImageUrl } from '../../utils/imageUrl';

export interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallback?: React.ReactNode;
}

/**
 * SafeImage component that resolves backend image paths using getImageUrl
 * and gracefully falls back to custom fallback content (or null) if the image
 * fails to load or is missing.
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  className = '',
  fallback = null,
  ...props
}) => {
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const resolvedSrc = getImageUrl(src);

  if (!resolvedSrc || errorSrc === resolvedSrc) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setErrorSrc(resolvedSrc)}
      {...props}
    />
  );
};
