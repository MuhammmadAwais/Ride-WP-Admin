import React, { useState } from 'react';
import { User, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUrl';

export interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'squircle';
  className?: string;
  showStatus?: boolean;
  isSuspended?: boolean;
  alt?: string;
  onClick?: () => void;
}

const SIZE_CONFIG = {
  xs: {
    container: 'w-7 h-7 text-[10px]',
    iconSize: 14,
    statusDot: 'w-2 h-2 -bottom-0.5 -right-0.5 border',
  },
  sm: {
    container: 'w-8 h-8 text-xs',
    iconSize: 16,
    statusDot: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 border',
  },
  md: {
    container: 'w-10 h-10 text-sm',
    iconSize: 18,
    statusDot: 'w-3 h-3 -bottom-0.5 -right-0.5 border-2',
  },
  lg: {
    container: 'w-12 h-12 text-base',
    iconSize: 22,
    statusDot: 'w-3.5 h-3.5 bottom-0 right-0 border-2',
  },
  xl: {
    container: 'w-20 h-20 text-2xl',
    iconSize: 32,
    statusDot: 'w-5 h-5 bottom-0 right-0 border-2',
  },
  '2xl': {
    container: 'w-28 h-28 sm:w-36 sm:h-36 text-3xl sm:text-4xl',
    iconSize: 48,
    statusDot: 'w-7 h-7 sm:w-8 sm:h-8 bottom-0 right-0 border-4',
  },
};

/**
 * Extracts 1-2 letter initials from a user's full name.
 */
function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * High-performance, resilient avatar component for Ride With Pals Admin.
 * Renders user profile photo or falls back gracefully to high-energy
 * brand initials on dark-orange gradient canvas.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  shape = 'circle',
  className = '',
  showStatus = false,
  isSuspended = false,
  alt,
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = getImageUrl(src);
  const initials = getInitials(name);
  const config = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  const shapeClasses =
    shape === 'squircle'
      ? size === '2xl'
        ? 'rounded-3xl'
        : 'rounded-2xl'
      : 'rounded-full';

  const shouldRenderImage = Boolean(resolvedSrc && !hasError);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex shrink-0 select-none ${config.container} ${onClick ? 'cursor-pointer hover:opacity-95' : ''} ${className}`}
      title={name || 'User Avatar'}
    >
      <div
        className={`w-full h-full ${shapeClasses} overflow-hidden border border-border bg-surface flex items-center justify-center transition-transform duration-200`}
      >
        {shouldRenderImage ? (
          <img
            src={resolvedSrc}
            alt={alt || name || 'User Avatar'}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
            loading="lazy"
          />
        ) : initials ? (
          <div
            className={`w-full h-full flex items-center justify-center font-poppins font-black text-accent bg-gradient-to-br from-accent/20 via-accent/10 to-surface tracking-wider`}
          >
            {initials}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent/5 text-accent/50">
            <User size={config.iconSize} />
          </div>
        )}
      </div>

      {showStatus && (
        <div
          className={`absolute ${config.statusDot} border-main-bg rounded-full flex items-center justify-center ${
            isSuspended ? 'bg-error text-white' : 'bg-success text-white'
          }`}
          title={isSuspended ? 'Suspended Account' : 'Active Account'}
        >
          {size === '2xl' ? (
            isSuspended ? (
              <ShieldAlert size={16} />
            ) : (
              <ShieldCheck size={16} />
            )
          ) : null}
        </div>
      )}
    </div>
  );
};
