import React, { useState, useRef, memo, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Reliable stable local/public 110m resolution World TopoJSON dataset CDN URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CountryGeographyProps {
  geo: any;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// Performance Isolation: memoize individual country paths to prevent UI re-renders during high-speed drag-panning
const CountryGeography = memo(({ geo, isHovered, onMouseEnter, onMouseLeave }: CountryGeographyProps) => {
  return (
    <Geography
      geography={geo}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`transition-colors duration-100 cursor-pointer outline-none ${
        isHovered 
          ? 'fill-[#EB712B] stroke-[#EB712B] stroke-[0.8]' 
          : 'fill-[#F6F6F6] dark:fill-[#202020] stroke-gray-300 dark:stroke-white/5 stroke-[0.4]'
      }`}
      style={{
        default: { outline: 'none' },
        hover: { outline: 'none' },
        pressed: { outline: 'none' }
      }}
    />
  );
}, (prev, next) => prev.isHovered === next.isHovered);

export default function DashboardMap() {
  const [position, setPosition] = useState({ coordinates: [0, 0] as [number, number], zoom: 1 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, visible: false, name: '' });
  const mapRef = useRef<HTMLDivElement>(null);

  // High performance cursor-following tooltip tracker (zero lag)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip.visible && mapRef.current) {
      const bounds = mapRef.current.getBoundingClientRect();
      setTooltip(prev => ({
        ...prev,
        x: e.clientX - bounds.left + 15,
        y: e.clientY - bounds.top - 50
      }));
    }
  };

  // Intercept scroll wheel events to zoom map dynamically & fully block browser page scroll
  useEffect(() => {
    const mapNode = mapRef.current;
    if (!mapNode) return;

    const handleNativeWheel = (e: WheelEvent) => {
      // Completely block default page scroll (passive: false forces the browser to obey e.preventDefault!)
      e.preventDefault();
      
      const zoomSpeed = 0.08;
      const direction = e.deltaY < 0 ? 1 : -1;
      setPosition(prev => {
        const newZoom = prev.zoom * (1 + direction * zoomSpeed);
        return {
          ...prev,
          zoom: Math.max(0.8, Math.min(8, newZoom))
        };
      });
    };

    mapNode.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      mapNode.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  const handleZoomIn = () => {
    setPosition(prev => ({ ...prev, zoom: Math.min(8, prev.zoom * 1.25) }));
  };

  const handleZoomOut = () => {
    setPosition(prev => ({ ...prev, zoom: Math.max(0.8, prev.zoom / 1.25) }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
  };

  return (
    <div 
      ref={mapRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[400px] bg-surface border border-border rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      <ComposableMap 
        projectionConfig={{ scale: 225 }} // Scaled up from 185 to make the world larger and fill the layout beautifully
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
                const countryName = geo.properties?.name || 'Unknown';
                const countryId = geo.rsmKey;
                return (
                  <CountryGeography
                    key={countryId}
                    geo={geo}
                    isHovered={hoveredCountry === countryId}
                    onMouseEnter={() => {
                      setHoveredCountry(countryId);
                      setTooltip(prev => ({ ...prev, visible: true, name: countryName }));
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                      setTooltip(prev => ({ ...prev, visible: false }));
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Floating Zoom Accessibility Overlays */}
      <div className="absolute bottom-5 right-5 flex flex-col gap-2 z-10">
        <button 
          type="button"
          onClick={handleZoomIn}
          className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-[#EB712B] transition-colors cursor-pointer select-none"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button 
          type="button"
          onClick={handleZoomOut}
          className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-[#EB712B] transition-colors cursor-pointer select-none"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button 
          type="button"
          onClick={handleReset}
          className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-[#EB712B] transition-colors cursor-pointer select-none"
          title="Reset Map Bounds"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Dynamic Cursor-Following Tooltip */}
      {tooltip.visible && (
        <div 
          className="absolute pointer-events-none bg-surface border border-border shadow-2xl rounded-2xl px-3 py-2 z-20 animate-in fade-in duration-100 min-w-[120px]"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          <h4 className="font-poppins font-bold text-text-main text-[11px] uppercase tracking-wider leading-none py-0.5">{tooltip.name}</h4>
        </div>
      )}

      {/* Region Indicator Badge */}
      <div className="absolute top-5 left-5 bg-surface/90 border border-border rounded-2xl p-3 pointer-events-none max-w-[200px]">
        <h4 className="font-poppins font-extrabold text-[11px] uppercase tracking-widest text-[#EB712B] leading-none">Global Active Hubs</h4>
        <p className="font-roboto text-[10px] text-text-muted mt-1.5 leading-normal">
          Scroll wheel zooms, drag panned to active sectors.
        </p>
      </div>
    </div>
  );
}
