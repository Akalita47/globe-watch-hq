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
}

const createCustomIcon = (severity: SeverityLevel) => {
  const colors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
  } as const;

  const svgIcon = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="${colors[severity]}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white" opacity="0.8"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
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

export const WorldMap: React.FC<WorldMapProps> = ({ events, onEventClick }) => {
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
      const marker = L.marker(event.location.coordinates, {
        icon: createCustomIcon(event.severity),
      });

      const popupHtml = `
        <div class="p-2 min-w-[300px]">
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
          <p class="text-xs text-muted-foreground mb-3">${event.description}</p>
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1">
              <span class="font-medium text-primary">${event.source.name}</span>
              <span class="text-muted-foreground">•</span>
              <span class="text-muted-foreground">${formatTimeAgo(event.timestamp)}</span>
            </div>
            <span class="text-muted-foreground">${event.location.city}, ${event.location.country}</span>
          </div>
        </div>`;

      marker.bindPopup(popupHtml, { className: 'event-popup' });
      marker.addTo(layer);
      marker.on('click', () => onEventClick?.(event));
    });
  }, [events, onEventClick]);

  return <div ref={containerRef} className="h-full w-full rounded-lg overflow-hidden" />;
};
