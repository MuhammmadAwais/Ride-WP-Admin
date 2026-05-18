import React from 'react';
import { type MapPath } from '../types';

interface MapPathItemProps {
  path: MapPath;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const MapPathItem: React.FC<MapPathItemProps> = ({ 
  path, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave, 
  onClick 
}) => {
  
  // Clean default country fill classes mapped directly to design theme tokens
  const baseClass = 'fill-main-bg stroke-border/30 stroke-[0.6] transition-colors duration-150 cursor-pointer';
  const hoverClass = isHovered 
    ? 'fill-[#EB712B] stroke-[#EB712B] stroke-[0.8]' 
    : '';

  return (
    <path
      d={path.path}
      className={`${baseClass} ${hoverClass}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ transformOrigin: 'center' }}
    />
  );
};

// SVG Performance Guard: memoize path structure to block recalculation overhead during zooming/panning (60 FPS fluid pan/zoom)
export default React.memo(MapPathItem, (prev, next) => {
  return (
    prev.isHovered === next.isHovered && 
    prev.path.id === next.path.id &&
    prev.path.path === next.path.path
  );
});
