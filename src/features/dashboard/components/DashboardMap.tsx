import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { MOCK_MAP_PATHS, MOCK_MAP_HOTSPOTS, type MapHubHotspot } from '../utils/constants';
import MapPathItem from './MapPathItem';

interface TooltipState {
  x: number;
  y: number;
  visible: boolean;
  title: string;
  details?: string;
}

export default function DashboardMap() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    visible: false,
    title: ''
  });

  const mapRef = useRef<HTMLDivElement>(null);

  // Mouse wheel Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const nextScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    setScale(Math.max(0.8, Math.min(8, nextScale)));
  };

  // Drag-to-pan triggers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    // High performance cursor-following tooltip (zero lag)
    if (tooltip.visible && mapRef.current) {
      const bounds = mapRef.current.getBoundingClientRect();
      setTooltip(prev => ({
        ...prev,
        x: e.clientX - bounds.left + 15,
        y: e.clientY - bounds.top - 60
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Hover triggers for countries
  const handleMouseEnterCountry = (id: string, name: string) => {
    setHoveredPath(id);
    setTooltip({
      x: 0,
      y: 0,
      visible: true,
      title: name
    });
  };

  const handleMouseLeaveCountry = () => {
    setHoveredPath(null);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // Hover triggers for hotspots
  const handleMouseEnterSpot = (spot: MapHubHotspot) => {
    setTooltip({
      x: 0,
      y: 0,
      visible: true,
      title: spot.name,
      details: spot.users
    });
  };

  const handleMouseLeaveSpot = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // Zoom Button Controls
  const zoomIn = () => setScale(prev => Math.min(8, prev * 1.25));
  const zoomOut = () => setScale(prev => Math.max(0.8, prev / 1.25));
  const resetMap = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={mapRef}
      className="relative w-full h-[400px] bg-surface border border-border rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Interactive Vector Canvas */}
      <svg 
        viewBox="0 0 1000 600" 
        className="w-full h-full transition-transform duration-75"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center'
        }}
      >
        {/* Render Countries */}
        {MOCK_MAP_PATHS.map(path => (
          <MapPathItem 
            key={path.id}
            path={path}
            isHovered={hoveredPath === path.id}
            onMouseEnter={() => handleMouseEnterCountry(path.id, path.name)}
            onMouseLeave={handleMouseLeaveCountry}
            onClick={() => handleMouseEnterCountry(path.id, path.name)}
          />
        ))}

        {/* Render Coordinated Hub Hotspots */}
        {MOCK_MAP_HOTSPOTS.map(spot => (
          <g key={spot.id}>
            {/* Pulsing ring */}
            <circle 
              cx={spot.x} 
              cy={spot.y} 
              r={9} 
              className="stroke-[#EB712B]/40 stroke-2 fill-none animate-ping"
              style={{ transformOrigin: `${spot.x}px ${spot.y}px` }}
            />
            {/* Core marker */}
            <circle 
              cx={spot.x} 
              cy={spot.y} 
              r={6} 
              className="stroke-[#EB712B] stroke-2 fill-surface cursor-pointer transition-all duration-150 hover:r-8"
              onMouseEnter={() => handleMouseEnterSpot(spot)}
              onMouseLeave={handleMouseLeaveSpot}
            />
          </g>
        ))}
      </svg>

      {/* Floating Zoom Accessibility Overlays */}
      <div className="absolute bottom-5 right-5 flex flex-col gap-2 z-10">
        <button 
          type="button"
          onClick={zoomIn}
          className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-[#EB712B] transition-colors cursor-pointer select-none"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button 
          type="button"
          onClick={zoomOut}
          className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-[#EB712B] transition-colors cursor-pointer select-none"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button 
          type="button"
          onClick={resetMap}
          className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-[#EB712B] transition-colors cursor-pointer select-none"
          title="Reset Map Bounds"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Dynamic Cursor-Following Tooltip */}
      {tooltip.visible && (
        <div 
          className="absolute pointer-events-none bg-surface border border-border shadow-2xl rounded-2xl px-3 py-2 z-20 space-y-0.5 animate-in fade-in duration-100 min-w-[120px]"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          <h4 className="font-poppins font-bold text-text-main text-[11px] uppercase tracking-wider leading-none py-0.5">{tooltip.title}</h4>
          {tooltip.details && (
            <p className="font-roboto text-[10px] text-[#EB712B] font-extrabold leading-none">{tooltip.details}</p>
          )}
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
