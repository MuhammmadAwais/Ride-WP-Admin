declare module 'react-simple-maps' {
  import * as React from 'react';

  export interface ComposableMapProps {
    width?: number;
    height?: number;
    projection?: string | ((...args: any[]) => any);
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
      parallels?: [number, number];
      [key: string]: any;
    };
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: (position: any, event: any) => void;
    onMove?: (position: any, event: any) => void;
    onMoveEnd?: (position: any, event: any) => void;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    filterZoomEvent?: (event: any) => boolean;
  }

  export interface GeographiesProps {
    geography?: string | { [key: string]: any } | string[];
    children?: (data: { geographies: any[]; outline: any; borders: any }) => React.ReactNode;
  }

  export interface GeographyProps {
    geography?: any;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    className?: string;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
    [key: string]: any;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
}
