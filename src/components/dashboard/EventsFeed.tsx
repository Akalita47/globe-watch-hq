import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Event, SeverityLevel } from '@/types/events';
import { Search, ExternalLink, Clock, MapPin, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventsFeedProps {
  events: Event[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEventSelect?: (event: Event) => void;
  selectedEventId?: string;
}

const severityColors = {
  critical: 'bg-severity-critical text-white',
  high: 'bg-severity-high text-white',
  medium: 'bg-severity-medium text-white',
  low: 'bg-severity-low text-white'
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

export const EventsFeed = ({ 
  events, 
  searchQuery, 
  onSearchChange, 
  onEventSelect,
  selectedEventId 
}: EventsFeedProps) => {
  const [sortBy, setSortBy] = useState<'time' | 'severity'>('time');

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'time') {
      return b.timestamp.getTime() - a.timestamp.getTime();
    } else {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
  });

  const filteredEvents = sortedEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Events</h2>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })} {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 mt-3">
          <Button
            variant={sortBy === 'time' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('time')}
            className="text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            Time
          </Button>
          <Button
            variant={sortBy === 'severity' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('severity')}
            className="text-xs"
          >
            <Filter className="w-3 h-3 mr-1" />
            Severity
          </Button>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No events match your search criteria</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className={cn(
                  "m-3 p-4 cursor-pointer transition-all duration-200 hover:shadow-glow border-border",
                  selectedEventId === event.id && "ring-2 ring-primary shadow-glow"
                )}
                onClick={() => onEventSelect?.(event)}
              >
                {/* Event Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-severity-${event.severity}`} />
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs px-2 py-0 border-0", severityColors[event.severity])}
                    >
                      {event.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimeAgo(event.timestamp)}
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="font-semibold text-sm mb-2 text-foreground line-clamp-2">
                  {event.title}
                </h3>

                {/* Event Description */}
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Footer */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-primary">
                    <span className="font-medium">{event.source.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location.city}, {event.location.country}</span>
                  </div>
                </div>

                {/* Tags */}
                {event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                    {event.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        +{event.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* External Link */}
                {event.url && (
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-primary hover:text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(event.url, '_blank');
                      }}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Source
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};