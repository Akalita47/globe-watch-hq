import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Event, SeverityLevel } from '@/types/events';

// Fix for default markers in react-leaflet
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
  shadowSize: [41, 41]
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
    low: '#22c55e'
  };

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
    popupAnchor: [0, -12]
  });
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (minutes < 60) {
    return `${minutes} min ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export const WorldMap = ({ events, onEventClick }: WorldMapProps) => {
  useEffect(() => {
    // Custom CSS for markers
    const style = document.createElement('style');
    style.textContent = `
      .custom-marker {
        background: transparent !important;
        border: none !important;
      }
      .leaflet-popup-content-wrapper {
        background: hsl(220 25% 10%);
        color: hsl(210 40% 95%);
        border-radius: 0.5rem;
        box-shadow: 0 10px 40px -10px hsl(220 27% 4% / 0.4);
      }
      .leaflet-popup-tip {
        background: hsl(220 25% 10%);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {events.map((event) => (
          <Marker
            key={event.id}
            position={event.location.coordinates}
            icon={createCustomIcon(event.severity)}
            eventHandlers={{
              click: () => onEventClick?.(event)
            }}
          >
            <Popup className="event-popup">
              <div className="p-2 min-w-[300px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full severity-${event.severity}`} />
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {event.severity}
                  </span>
                </div>
                
                <h3 className="font-semibold text-sm mb-2 text-foreground">
                  {event.title}
                </h3>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-primary">{event.source.name}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{formatTimeAgo(event.timestamp)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {event.location.city}, {event.location.country}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};