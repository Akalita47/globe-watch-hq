export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type SourceType = 'news' | 'government' | 'social' | 'satellite';
export type Region = 'global' | 'north-america' | 'south-america' | 'europe' | 'africa' | 'asia' | 'oceania';

export interface Event {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  source: {
    name: string;
    type: SourceType;
  };
  location: {
    country: string;
    city?: string;
    coordinates: [number, number]; // [lat, lng]
  };
  timestamp: Date;
  tags: string[];
  url?: string;
}

export interface FilterState {
  region: Region;
  severity: SeverityLevel[];
  timeRange: '24h' | '7d' | '30d' | 'all';
  sourceTypes: SourceType[];
  searchQuery: string;
}