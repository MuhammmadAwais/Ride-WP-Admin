/**
 * Ambient type declarations for Google Maps JavaScript API
 */

declare namespace google.maps {
  export interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    styles?: MapTypeStyle[];
    disableDefaultUI?: boolean;
    zoomControl?: boolean;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
    backgroundColor?: string;
    [key: string]: any;
  }

  export interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  export class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  export class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    extend(point: LatLng | LatLngLiteral): LatLngBounds;
    getCenter(): LatLng;
    isEmpty(): boolean;
  }

  export interface MapTypeStyle {
    elementType?: string;
    featureType?: string;
    stylers: object[];
  }

  export class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
    getCenter(): LatLng | undefined;
    setZoom(zoom: number): void;
    getZoom(): number | undefined;
    panTo(latLng: LatLng | LatLngLiteral): void;
    fitBounds(bounds: LatLngBounds): void;
    addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
  }

  export class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(latLng: LatLng | LatLngLiteral): void;
    getPosition(): LatLng | undefined;
    addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
  }

  export interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | ReadonlyIcon | Symbol;
    animation?: any;
    [key: string]: any;
  }

  export interface Point {
    x: number;
    y: number;
  }

  export class Point {
    constructor(x: number, y: number);
  }

  export interface Symbol {
    path: string;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWeight?: number;
    scale?: number;
    anchor?: Point;
    [key: string]: any;
  }

  export interface ReadonlyIcon {
    url: string;
    [key: string]: any;
  }

  export const Animation: {
    BOUNCE: number;
    DROP: number;
  };

  export class Geocoder {
    geocode(
      request: { address?: string; location?: LatLng | LatLngLiteral },
      callback: (results: any[] | null, status: string) => void
    ): void;
  }

  export const event: {
    addListener(instance: any, eventName: string, handler: (...args: any[]) => void): MapsEventListener;
    removeListener(listener: MapsEventListener): void;
  };

  export interface MapsEventListener {
    remove(): void;
  }
}

declare interface Window {
  google?: {
    maps: typeof google.maps;
  };
}
