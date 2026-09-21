/**
 * @fileoverview Interactive Google Maps surveillance view for platform clubs.
 * Connects to useGetClubsListQuery, plots geocoded club markers with custom dark theme styling,
 * supports fluid dragging, zooming, privacy filtering, and renders the rich ClubMapDetailCard.
 */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Search,
  X,
  Loader2,
  AlertCircle,
  Compass,
} from 'lucide-react';
import { useGetClubsListQuery } from '@/features/clubs/api/clubApi';
import type { ClubListItem } from '@/features/clubs/types/clubTypes';
import ClubMapDetailCard from './ClubMapDetailCard';

// ── Google Maps Custom Dark Theme Stylesheet ──────────────────────────────────
const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#18181b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#18181b' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#71717a' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#a1a1aa' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#71717a' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#1f1f23' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#52525b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#27272a' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#18181b' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#a1a1aa' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3f3f46' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#18181b' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#e4e4e7' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#27272a' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#71717a' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#09090b' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3f3f46' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#09090b' }],
  },
];

// ── Known City/Country Coordinates Dictionary [lat, lng] ─────────────────────
const KNOWN_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'zaragoza': { lat: 41.6488, lng: -0.8891 },
  'zaragoza, spain': { lat: 41.6488, lng: -0.8891 },
  'madrid': { lat: 40.4168, lng: -3.7038 },
  'madrid, spain': { lat: 40.4168, lng: -3.7038 },
  'barcelona': { lat: 41.3851, lng: 2.1734 },
  'barcelona, spain': { lat: 41.3851, lng: 2.1734 },
  'valencia': { lat: 39.4699, lng: -0.3763 },
  'seville': { lat: 37.3891, lng: -5.9845 },
  'new york': { lat: 40.7128, lng: -74.006 },
  'new york, usa': { lat: 40.7128, lng: -74.006 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'miami': { lat: 25.7617, lng: -80.1918 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'london, uk': { lat: 51.5074, lng: -0.1278 },
  'manchester': { lat: 53.4808, lng: -2.2426 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'paris, france': { lat: 48.8566, lng: 2.3522 },
  'berlin': { lat: 52.52, lng: 13.405 },
  'berlin, germany': { lat: 52.52, lng: 13.405 },
  'amsterdam': { lat: 52.3676, lng: 4.9041 },
  'rome': { lat: 41.9028, lng: 12.4964 },
  'tokyo': { lat: 35.6895, lng: 139.6917 },
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'toronto': { lat: 43.6532, lng: -79.3832 },
  'sao paulo': { lat: -23.5505, lng: -46.6333 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
};

// In-memory cache to avoid duplicate geocoding API calls
const geocodeCache = new Map<string, { lat: number; lng: number }>();

function parseFallbackCoordinates(locationStr: string, clubId: number): { lat: number; lng: number } {
  const norm = (locationStr || '').toLowerCase();
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (norm.includes(key)) {
      const jitterLat = (((clubId * 13) % 7) - 3) * 0.015;
      const jitterLng = (((clubId * 17) % 7) - 3) * 0.015;
      return { lat: coords.lat + jitterLat, lng: coords.lng + jitterLng };
    }
  }

  // Global hub fallbacks
  const fallbackList = [
    { lat: 41.6488, lng: -0.8891 }, // Zaragoza
    { lat: 40.7128, lng: -74.006 },  // New York
    { lat: 40.4168, lng: -3.7038 },  // Madrid
    { lat: 51.5074, lng: -0.1278 },  // London
    { lat: 48.8566, lng: 2.3522 },   // Paris
    { lat: 41.3851, lng: 2.1734 },   // Barcelona
    { lat: 37.7749, lng: -122.4194 },// SF
  ];
  const base = fallbackList[clubId % fallbackList.length];
  const jitterLat = (((clubId * 19) % 9) - 4) * 0.02;
  const jitterLng = (((clubId * 23) % 9) - 4) * 0.02;
  return { lat: base.lat + jitterLat, lng: base.lng + jitterLng };
}

export default function DashboardMap() {
  const { data: clubsData, isLoading } = useGetClubsListQuery({ limit: 100 });
  const clubs = clubsData?.clubs || [];

  const [filterPrivacy, setFilterPrivacy] = useState<'all' | 'public' | 'private'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<ClubListItem | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // Filtered clubs by privacy and search query
  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      if (filterPrivacy !== 'all') {
        const privacy = (c.clubPrivacyName || 'Public').toLowerCase();
        if (privacy !== filterPrivacy) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.clubName?.toLowerCase().includes(q);
        const matchLoc = c.location?.toLowerCase().includes(q);
        const matchType = c.clubTypeName?.toLowerCase().includes(q);
        return matchName || matchLoc || matchType;
      }
      return true;
    });
  }, [clubs, filterPrivacy, searchQuery]);

  // ── Load Google Maps JavaScript API ──────────────────────────────────────────
  useEffect(() => {
    if (window.google?.maps) {
      setIsMapLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    const scriptId = 'google-maps-sdk-script';

    if (document.getElementById(scriptId)) {
      const interval = setInterval(() => {
        if (window.google?.maps) {
          setIsMapLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsMapLoaded(true);
    };

    script.onerror = () => {
      setLoadError('Failed to load Google Maps SDK. Please check network connection or API key.');
    };

    document.head.appendChild(script);
  }, []);

  // ── Initialize Google Maps Instance ──────────────────────────────────────────
  useEffect(() => {
    if (!isMapLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: 38.0, lng: -15.0 },
        zoom: 3,
        minZoom: 2,
        maxZoom: 18,
        styles: DARK_MAP_STYLES,
        disableDefaultUI: true, // We build clean, modern custom UI controls
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy', // Drag without holding Ctrl
        backgroundColor: '#18181b',
      });

      // Dismiss card when clicking on map background
      map.addListener('click', () => {
        setSelectedClub(null);
      });

      mapInstanceRef.current = map;
      geocoderRef.current = new google.maps.Geocoder();
    } catch (err) {
      console.error('Error initializing Google Map:', err);
      setLoadError('Error initializing Google Maps.');
    }
  }, [isMapLoaded]);

  // ── Plot Club Markers on Google Maps ─────────────────────────────────────────
  const plotMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const map = mapInstanceRef.current;
    const bounds = new google.maps.LatLngBounds();
    let hasValidBounds = false;

    filteredClubs.forEach((club) => {
      // Check cache or known dictionary first
      const cached = geocodeCache.get(club.location);
      const coords = cached || parseFallbackCoordinates(club.location, club.id);

      // SVG Icon with #EB712B Accent Pin
      const isSelected = selectedClub?.id === club.id;
      const marker = new google.maps.Marker({
        position: coords,
        map,
        title: club.clubName,
        animation: google.maps.Animation.DROP,
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: isSelected ? '#FFFFFF' : '#EB712B',
          fillOpacity: 1,
          strokeColor: isSelected ? '#EB712B' : '#FFFFFF',
          strokeWeight: 2,
          scale: isSelected ? 1.8 : 1.4,
          anchor: new google.maps.Point(12, 22),
        },
      });

      marker.addListener('click', () => {
        setSelectedClub(club);
        map.panTo(coords);
        if (map.getZoom()! < 8) {
          map.setZoom(8);
        }
      });

      markersRef.current.push(marker);
      bounds.extend(coords);
      hasValidBounds = true;

      // Asynchronously attempt geocode for pinpoint address accuracy if not cached
      if (!cached && geocoderRef.current && club.location) {
        geocoderRef.current.geocode({ address: club.location }, (results: any, status: string) => {
          if (status === 'OK' && results && results[0]) {
            const pos = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            };
            geocodeCache.set(club.location, pos);
            marker.setPosition(pos);
          }
        });
      }
    });

    // Auto-fit bounds if multiple clubs exist and no club is selected
    if (hasValidBounds && !selectedClub && filteredClubs.length > 0) {
      map.fitBounds(bounds);
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 7) map.setZoom(7);
        google.maps.event.removeListener(listener);
      });
    }
  }, [filteredClubs, selectedClub]);

  useEffect(() => {
    if (isMapLoaded && mapInstanceRef.current) {
      plotMarkers();
    }
  }, [isMapLoaded, plotMarkers]);

  // ── Custom Map Zoom Controls ────────────────────────────────────────────────
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 4) + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 4) - 1);
    }
  };

  const handleReset = () => {
    setSelectedClub(null);
    if (mapInstanceRef.current && markersRef.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach((m) => {
        const pos = m.getPosition();
        if (pos) bounds.extend(pos);
      });
      mapInstanceRef.current.fitBounds(bounds);
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: 38.0, lng: -15.0 });
      mapInstanceRef.current.setZoom(3);
    }
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[560px] bg-surface border border-border rounded-3xl overflow-hidden shadow-sm select-none">
      {/* Google Maps Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Loading Overlay */}
      {(!isMapLoaded || isLoading) && !loadError && (
        <div className="absolute inset-0 bg-surface/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30">
          <Loader2 size={36} className="animate-spin text-accent" />
          <p className="font-poppins font-medium text-sm text-text-muted">
            Initializing Google Maps & plotting global clubs...
          </p>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 bg-surface/95 backdrop-blur-md flex flex-col items-center justify-center gap-3 p-6 text-center z-30">
          <AlertCircle size={36} className="text-red-400" />
          <h4 className="font-poppins font-bold text-base text-text-main">Map Initialization</h4>
          <p className="font-roboto text-sm text-text-muted max-w-md">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-accent text-white font-poppins font-bold text-xs uppercase tracking-wider mt-2 cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      )}

      {/* ── Top Header Controls & Privacy Filter ───────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
        {/* Network Badge */}
        <div className="bg-surface/90 backdrop-blur-xl border border-border rounded-2xl p-3 shadow-lg flex items-center gap-3 pointer-events-auto">
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <Navigation size={18} />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-xs sm:text-sm text-text-main leading-tight flex items-center gap-2">
              <span>Global Club Surveillance</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono font-bold border border-accent/20">
                {filteredClubs.length} Active
              </span>
            </h4>
            <p className="font-roboto text-[11px] text-text-muted mt-0.5">
              Drag, zoom, and select club pins across worldwide chapters
            </p>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Quick Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <Search size={14} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search club or city..."
              className="bg-surface/90 backdrop-blur-xl border border-border text-text-main text-xs rounded-2xl pl-8 pr-7 py-2 outline-none focus:border-accent/60 shadow-lg font-roboto w-44 sm:w-48 placeholder:text-text-muted/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-text-muted hover:text-text-main"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Privacy Segmented Control */}
          <div className="flex items-center gap-1 bg-surface/90 backdrop-blur-xl border border-border p-1 rounded-2xl shadow-lg font-poppins text-xs">
            {(['all', 'public', 'private'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterPrivacy(tab)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-all cursor-pointer ${
                  filterPrivacy === tab
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating Zoom & Reset Controls ─────────────────────────────────── */}
      <div className="absolute bottom-5 right-5 flex flex-col gap-2 z-10 pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-10 h-10 bg-surface/90 hover:bg-surface backdrop-blur-xl border border-border rounded-2xl flex items-center justify-center text-text-muted hover:text-accent transition-all cursor-pointer shadow-lg hover:scale-105"
          title="Zoom In (+)"
        >
          <ZoomIn size={18} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-10 h-10 bg-surface/90 hover:bg-surface backdrop-blur-xl border border-border rounded-2xl flex items-center justify-center text-text-muted hover:text-accent transition-all cursor-pointer shadow-lg hover:scale-105"
          title="Zoom Out (-)"
        >
          <ZoomOut size={18} />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-10 h-10 bg-surface/90 hover:bg-surface backdrop-blur-xl border border-border rounded-2xl flex items-center justify-center text-text-muted hover:text-accent transition-all cursor-pointer shadow-lg hover:scale-105"
          title="Reset Global Bounds"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* ── Redesigned Premium Club Detail Card ────────────────────────────── */}
      {selectedClub && (
        <ClubMapDetailCard
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
        />
      )}
    </div>
  );
}
