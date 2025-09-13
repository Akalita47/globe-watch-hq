import { useState, useEffect, useMemo } from 'react';
import { WorldMap } from './WorldMap';
import { Sidebar } from './Sidebar';
import { EventsFeed } from './EventsFeed';
import { Header } from './Header';
import { N8nAutomationHub } from '../automation/N8nAutomationHub';
import { AdvancedAnalytics } from '../analytics/AdvancedAnalytics';
import { ExportManager } from '../enterprise/ExportManager';
import { Event, FilterState } from '@/types/events';
import { sampleEvents } from '@/data/sampleEvents';
import { useToast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAutomationHub, setShowAutomationHub] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showExportManager, setShowExportManager] = useState(false);
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FilterState>({
    region: 'global',
    severity: ['critical', 'high', 'medium', 'low'],
    timeRange: '24h',
    sourceTypes: ['news', 'government', 'social', 'satellite'],
    searchQuery: ''
  });

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Severity filter
      if (!filters.severity.includes(event.severity)) return false;
      
      // Source type filter
      if (!filters.sourceTypes.includes(event.source.type)) return false;
      
      // Time range filter
      const now = new Date();
      const eventTime = event.timestamp;
      const timeDiff = now.getTime() - eventTime.getTime();
      
      switch (filters.timeRange) {
        case '24h':
          if (timeDiff > 24 * 60 * 60 * 1000) return false;
          break;
        case '7d':
          if (timeDiff > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case '30d':
          if (timeDiff > 30 * 24 * 60 * 60 * 1000) return false;
          break;
        case 'all':
          // No time filter
          break;
      }
      
      // Search query filter (applied in EventsFeed component)
      return true;
    });
  }, [events, filters]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      // In a real app, this would fetch new data from the API
      // For now, we'll just update the timestamps to simulate new data
      const updatedEvents = sampleEvents.map(event => ({
        ...event,
        timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000) // Random time within last 6 hours
      }));
      
      setEvents(updatedEvents);
      setIsRefreshing(false);
      
      toast({
        title: "Dashboard Updated",
        description: `Refreshed ${updatedEvents.length} events from OSINT sources`,
      });
    }, 1500);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    toast({
      title: "Event Selected",
      description: `${event.title} - ${event.location.country}`,
    });
  };

  const handleCreateReport = () => {
    toast({
      title: "Analysis Report",
      description: "Creating comprehensive geopolitical analysis report...",
    });
  };

  // Auto-refresh every 5 minutes (in a real app)
  useEffect(() => {
    const interval = setInterval(() => {
      // Auto refresh logic would go here
      console.log('Auto-refreshing data...');
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const totalEvents = filteredEvents.length;
  const criticalEvents = filteredEvents.filter(e => e.severity === 'critical').length;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        totalEvents={totalEvents}
        criticalEvents={criticalEvents}
        onCreateReport={handleCreateReport}
        onOpenAutomation={() => setShowAutomationHub(true)}
        onOpenAnalytics={() => setShowAdvancedAnalytics(true)}
        onOpenExport={() => setShowExportManager(true)}
      />

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar - Filters & Analytics - Hidden on mobile, shown as drawer */}
        <div className="hidden lg:block">
          <Sidebar
            filters={filters}
            onFiltersChange={setFilters}
            events={filteredEvents}
          />
        </div>

        {/* Center - World Map */}
        <div className="flex-1 relative overflow-hidden order-1 lg:order-none">
          <div className="absolute inset-0 p-2 lg:p-4">
            <div className="h-full w-full rounded-lg overflow-hidden shadow-dashboard">
              <WorldMap 
                events={filteredEvents}
                onEventClick={handleEventClick}
                selectedEventId={selectedEvent?.id}
              />
            </div>
          </div>
          
          {/* Map Overlay - Selected Event Info - Responsive */}
          {selectedEvent && (
            <div className="absolute top-2 left-2 right-2 lg:top-6 lg:right-6 lg:left-auto lg:w-80 bg-card border border-border rounded-lg shadow-dashboard p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full bg-severity-${selectedEvent.severity} animate-pulse`} />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {selectedEvent.severity}
                </span>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded"
                >
                  ✕
                </button>
              </div>
              
              <h3 className="font-semibold text-sm mb-2 text-foreground">
                {selectedEvent.title}
              </h3>
              
              <p className="text-xs text-muted-foreground mb-3">
                {selectedEvent.description}
              </p>
              
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">{selectedEvent.source.name}</span>
                  <span className="text-right">{selectedEvent.location.city}, {selectedEvent.location.country}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Events Feed - Responsive */}
        <div className="order-2 lg:order-none">
          <EventsFeed
            events={filteredEvents}
            searchQuery={filters.searchQuery}
            onSearchChange={(query) => setFilters({ ...filters, searchQuery: query })}
            onEventSelect={handleEventClick}
            selectedEventId={selectedEvent?.id}
          />
        </div>
      </div>

      {/* Advanced Analytics Overlay */}
      <AdvancedAnalytics
        events={filteredEvents}
        isVisible={showAdvancedAnalytics}
      />
      {showAdvancedAnalytics && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => setShowAdvancedAnalytics(false)}
        />
      )}

      {/* Export Manager Modal */}
      <ExportManager
        events={filteredEvents}
        isVisible={showExportManager}
        onClose={() => setShowExportManager(false)}
      />

      {/* n8n Automation Hub Modal */}
      {showAutomationHub && (
        <N8nAutomationHub
          onClose={() => setShowAutomationHub(false)}
          events={filteredEvents}
        />
      )}
    </div>
  );
};