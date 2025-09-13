import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Event, SeverityLevel } from '@/types/events';

// Fix for default marker icons path in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface WorldMapProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  selectedEventId?: string;
}

const createCustomIcon = (severity: SeverityLevel, isSelected: boolean = false) => {
  const colors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
  } as const;

  const size = isSelected ? 32 : 24;
  const pulseClass = isSelected ? 'animate-pulse' : '';
  
  const svgIcon = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${pulseClass}">
      <circle cx="12" cy="12" r="8" fill="${colors[severity]}" stroke="white" stroke-width="${isSelected ? '3' : '2'}"/>
      <circle cx="12" cy="12" r="4" fill="white" opacity="${isSelected ? '1' : '0.8'}"/>
      ${isSelected ? '<circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="1" opacity="0.6"/>' : ''}
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2],
  });
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export const WorldMap: React.FC<WorldMapProps> = ({ events, onEventClick, selectedEventId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Theme overrides for Leaflet popups
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-marker { background: transparent !important; border: none !important; }
      .leaflet-popup-content-wrapper {
        background: hsl(220 25% 10%);
        color: hsl(210 40% 95%);
        border-radius: 0.5rem;
        box-shadow: 0 10px 40px -10px hsl(220 27% 4% / 0.4);
      }
      .leaflet-popup-tip { background: hsl(220 25% 10%); }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      worldCopyJump: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when events change
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    events.forEach((event) => {
      const isSelected = event.id === selectedEventId;
      const marker = L.marker(event.location.coordinates, {
        icon: createCustomIcon(event.severity, isSelected),
      });

      const popupHtml = `
        <div class="p-2 min-w-[300px] max-w-[320px]">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 rounded-full ${
              event.severity === 'critical'
                ? 'bg-severity-critical'
                : event.severity === 'high'
                ? 'bg-severity-high'
                : event.severity === 'medium'
                ? 'bg-severity-medium'
                : 'bg-severity-low'
            }"></div>
            <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">${event.severity}</span>
          </div>
          <h3 class="font-semibold text-sm mb-2 text-foreground">${event.title}</h3>
          <p class="text-xs text-muted-foreground mb-3 line-clamp-3">${event.description}</p>
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1">
              <span class="font-medium text-primary">${event.source.name}</span>
              <span class="text-muted-foreground">•</span>
              <span class="text-muted-foreground">${formatTimeAgo(event.timestamp)}</span>
            </div>
            <span class="text-muted-foreground">${event.location.city}, ${event.location.country}</span>
          </div>
          ${event.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1 mt-2">
              ${event.tags.slice(0, 3).map(tag => `<span class="text-xs px-2 py-1 bg-secondary rounded text-secondary-foreground">${tag}</span>`).join('')}
              ${event.tags.length > 3 ? `<span class="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">+${event.tags.length - 3}</span>` : ''}
            </div>
          ` : ''}
        </div>`;

      marker.bindPopup(popupHtml, { 
        className: 'event-popup',
        maxWidth: 350,
        closeButton: true
      });
      marker.addTo(layer);
      marker.on('click', () => onEventClick?.(event));
      
      // Auto-open popup for selected event
      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [events, onEventClick, selectedEventId]);

  return <div ref={containerRef} className="h-full w-full rounded-lg overflow-hidden" />;
};
