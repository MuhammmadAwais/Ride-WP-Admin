import React, { useState, useRef, memo, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Shield,
  Users,
  MapPin,
  ExternalLink,
  X,
  Search,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { useGetClubsListQuery } from '@/features/clubs/api/clubApi';
import type { ClubListItem } from '@/features/clubs/types/clubTypes';
import { SafeImage } from '@/Components/common/SafeImage';
import { ROUTES } from '@/Constants';

// Reliable stable 110m resolution World TopoJSON dataset CDN URL
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Known major city/country coordinates [longitude, latitude]
const LOCATION_COORDINATES: Record<string, [number, number]> = {
  'new york': [-74.006, 40.7128],
  'new york, usa': [-74.006, 40.7128],
  'los angeles': [-118.2437, 34.0522],
  'california': [-119.4179, 36.7783],
  'san francisco': [-122.4194, 37.7749],
  'chicago': [-87.6298, 41.8781],
  'miami': [-80.1918, 25.7617],
  'london': [-0.1278, 51.5074],
  'london, uk': [-0.1278, 51.5074],
  'manchester': [-2.2426, 53.4808],
  'madrid': [-3.7038, 40.4168],
  'madrid, spain': [-3.7038, 40.4168],
  'barcelona': [2.1734, 41.3851],
  'barcelona, spain': [2.1734, 41.3851],
  'paris': [2.3522, 48.8566],
  'paris, france': [2.3522, 48.8566],
  'berlin': [13.405, 52.52],
  'berlin, germany': [13.405, 52.52],
  'amsterdam': [4.9041, 52.3676],
  'rome': [12.4964, 41.9028],
  'rome, italy': [12.4964, 41.9028],
  'tokyo': [139.6917, 35.6895],
  'sydney': [151.2093, -33.8688],
  'melbourne': [144.9631, -37.8136],
  'toronto': [-79.3832, 43.6532],
  'vancouver': [-123.1207, 49.2827],
  'sao paulo': [-46.6333, -23.5505],
  'dubai': [55.2708, 25.2048],
  'singapore': [103.8198, 1.3521],
  'cape town': [18.4241, -33.9249],
};

function getClubCoordinates(locationStr: string, clubId: number): [number, number] {
  const normalized = (locationStr || '').toLowerCase().trim();
  
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (normalized.includes(key)) {
      // Deterministic small jitter so co-located clubs don't completely overlap
      const jitterLng = ((clubId * 17) % 7 - 3) * 1.2;
      const jitterLat = ((clubId * 13) % 7 - 3) * 0.8;
      return [coords[0] + jitterLng, coords[1] + jitterLat];
    }
  }

  // Fallback: spread across major world activity hubs based on club ID
  const fallbackHubs: [number, number][] = [
    [-74.006, 40.7128], // NY
    [-3.7038, 40.4168],  // Madrid
    [2.1734, 41.3851],   // BCN
    [-0.1278, 51.5074],  // London
    [2.3522, 48.8566],   // Paris
    [-122.4194, 37.7749],// SF
    [13.405, 52.52],     // Berlin
    [151.2093, -33.8688] // Sydney
  ];

  const base = fallbackHubs[clubId % fallbackHubs.length];
  const jitterLng = ((clubId * 23) % 9 - 4) * 0.8;
  const jitterLat = ((clubId * 19) % 9 - 4) * 0.6;
  return [base[0] + jitterLng, base[1] + jitterLat];
}

interface CountryGeographyProps {
  geo: any;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CountryGeography = memo(
  ({ geo, isHovered, onMouseEnter, onMouseLeave }: CountryGeographyProps) => {
    return (
      <Geography
        geography={geo}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`transition-colors duration-150 cursor-pointer outline-none ${
          isHovered
            ? 'fill-accent/20 stroke-accent stroke-[0.8]'
            : 'fill-[#F4F4F6] dark:fill-[#1A1A1E] stroke-gray-300 dark:stroke-white/5 stroke-[0.4]'
        }`}
        style={{
          default: { outline: 'none' },
          hover: { outline: 'none' },
          pressed: { outline: 'none' },
        }}
      />
    );
  },
  (prev, next) => prev.isHovered === next.isHovered
);

export default function DashboardMap() {
  const navigate = useNavigate();
  const { data: clubsData, isLoading } = useGetClubsListQuery({ limit: 50 });
  const clubs = clubsData?.clubs || [];

  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1.15 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedClub, setSelectedClub] = useState<ClubListItem | null>(null);
  const [filterPrivacy, setFilterPrivacy] = useState<'all' | 'public' | 'private'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);

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

  // Intercept scroll wheel events to zoom map dynamically
  useEffect(() => {
    const mapNode = mapRef.current;
    if (!mapNode) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.08;
      const direction = e.deltaY < 0 ? 1 : -1;
      setPosition((prev) => {
        const newZoom = prev.zoom * (1 + direction * zoomSpeed);
        return {
          ...prev,
          zoom: Math.max(0.8, Math.min(8, newZoom)),
        };
      });
    };

    mapNode.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      mapNode.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  const handleZoomIn = () => {
    setPosition((prev) => ({ ...prev, zoom: Math.min(8, prev.zoom * 1.25) }));
  };

  const handleZoomOut = () => {
    setPosition((prev) => ({ ...prev, zoom: Math.max(0.8, prev.zoom / 1.25) }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 20], zoom: 1.15 });
    setSelectedClub(null);
  };

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setTimeout(() => {
      setPosition(newPosition);
    }, 0);
  };

  const handleClubPinClick = (club: ClubListItem, coords: [number, number]) => {
    setSelectedClub(club);
    // Smoothly center map slightly towards the selected marker
    setPosition((prev) => ({
      coordinates: coords,
      zoom: Math.max(prev.zoom, 2.2),
    }));
  };

  return (
    <div
      ref={mapRef}
      className="relative w-full h-[460px] bg-surface border border-border rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-sm"
    >
      <ComposableMap
        projectionConfig={{ scale: 220 }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          maxZoom={8}
          minZoom={0.8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryId = geo.rsmKey;
                return (
                  <CountryGeography
                    key={countryId}
                    geo={geo}
                    isHovered={hoveredCountry === countryId}
                    onMouseEnter={() => setHoveredCountry(countryId)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                );
              })
            }
          </Geographies>

          {/* Dynamic Interactive Club Markers */}
          {filteredClubs.map((club) => {
            const coords = getClubCoordinates(club.location, club.id);
            const isSelected = selectedClub?.id === club.id;

            return (
              <Marker
                key={club.id}
                coordinates={coords}
                onClick={() => handleClubPinClick(club, coords)}
              >
                <g className="cursor-pointer group">
                  {/* Outer Pulsing Ping Ring */}
                  <circle
                    r={isSelected ? 16 : 10}
                    className="fill-accent/20 animate-ping opacity-75"
                  />
                  {/* Glow Backdrop */}
                  <circle
                    r={isSelected ? 14 : 9}
                    className={`${
                      isSelected
                        ? 'fill-accent/40 stroke-accent stroke-2'
                        : 'fill-accent/30 group-hover:fill-accent/50'
                    } transition-all`}
                  />
                  {/* Core Pin */}
                  <circle
                    r={isSelected ? 7 : 5}
                    className="fill-accent stroke-white dark:stroke-[#18181B] stroke-2 shadow-lg"
                  />
                  {/* Label on Hover / Selection */}
                  <text
                    textAnchor="middle"
                    y={-14}
                    className={`font-poppins font-bold text-[10px] fill-text-main pointer-events-none transition-opacity drop-shadow-md ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {club.clubName}
                  </text>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Top Overlay: Title & Filters Bar */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 pointer-events-auto">
        <div className="bg-surface/90 backdrop-blur-xl border border-border rounded-2xl p-3 shadow-md flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <Navigation size={16} />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-xs text-text-main leading-tight flex items-center gap-1.5">
              <span>Global Club Network</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-accent/10 text-accent font-mono font-bold">
                {filteredClubs.length} Active
              </span>
            </h4>
            <p className="font-roboto text-[11px] text-text-muted mt-0.5">
              Click pins to inspect club details
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-surface/90 backdrop-blur-xl border border-border p-1 rounded-2xl shadow-md">
          {(['all', 'public', 'private'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterPrivacy(tab)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-poppins font-semibold capitalize transition-all cursor-pointer ${
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

      {/* Floating Zoom Controls */}
      <div className="absolute bottom-5 right-5 flex flex-col gap-2 z-10">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-9 h-9 bg-surface/90 backdrop-blur-xl border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-accent transition-colors cursor-pointer shadow-md"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-9 h-9 bg-surface/90 backdrop-blur-xl border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-accent transition-colors cursor-pointer shadow-md"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-9 h-9 bg-surface/90 backdrop-blur-xl border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-accent transition-colors cursor-pointer shadow-md"
          title="Reset Map Bounds"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Interactive Selected Club Card Overlay */}
      {selectedClub && (
        <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:w-[320px] bg-surface/95 backdrop-blur-2xl border border-border/80 rounded-2xl p-4 shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <SafeImage
                src={selectedClub.logo}
                alt={selectedClub.clubName}
                className="w-11 h-11 rounded-xl object-cover border border-border bg-main-bg shrink-0"
                fallback={
                  <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold">
                    <Shield size={20} />
                  </div>
                }
              />
              <div className="min-w-0">
                <h4 className="font-poppins font-bold text-sm text-text-main truncate leading-tight">
                  {selectedClub.clubName}
                </h4>
                <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-roboto mt-0.5">
                  <MapPin size={11} className="text-accent shrink-0" />
                  <span className="truncate">{selectedClub.location || 'Global Hub'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedClub(null)}
              className="p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-main-bg transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-main-bg/60 border border-border/60 text-xs">
            <div>
              <span className="text-[10px] font-poppins text-text-muted uppercase tracking-wider block">
                Members
              </span>
              <span className="font-poppins font-bold text-text-main">
                {selectedClub.participantCount || 0} Athletes
              </span>
            </div>
            <div>
              <span className="text-[10px] font-poppins text-text-muted uppercase tracking-wider block">
                Access Tier
              </span>
              <span className="font-poppins font-bold text-accent">
                {selectedClub.clubPrivacyName || 'Public'}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`${ROUTES.CLUBS}/${selectedClub.id}`)}
            className="w-full py-2 px-3 rounded-xl bg-accent text-white font-poppins font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-accent/90 transition-colors shadow-sm shadow-accent/20 cursor-pointer"
          >
            <span>Inspect Club Details</span>
            <ExternalLink size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
