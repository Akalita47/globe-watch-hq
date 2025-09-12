import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FilterState, Event, SeverityLevel, SourceType, Region } from '@/types/events';
import { Globe, Shield, Clock, Radio, User } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  events: Event[];
}

const regions: { value: Region; label: string }[] = [
  { value: 'global', label: 'All Regions' },
  { value: 'north-america', label: 'North America' },
  { value: 'south-america', label: 'South America' },
  { value: 'europe', label: 'Europe' },
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'oceania', label: 'Oceania' }
];

const severityLevels: { value: SeverityLevel; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: 'severity-critical' },
  { value: 'high', label: 'High', color: 'severity-high' },
  { value: 'medium', label: 'Medium', color: 'severity-medium' },
  { value: 'low', label: 'Low', color: 'severity-low' }
];

const sourceTypes: { value: SourceType; label: string }[] = [
  { value: 'news', label: 'News Media' },
  { value: 'government', label: 'Government' },
  { value: 'social', label: 'Social Media' },
  { value: 'satellite', label: 'Satellite' }
];

const timeRanges = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'all', label: 'All time' }
];

export const Sidebar = ({ filters, onFiltersChange, events }: SidebarProps) => {
  const [isExpanded] = useState(true);

  const handleSeverityChange = (severity: SeverityLevel, checked: boolean) => {
    const newSeverity = checked
      ? [...filters.severity, severity]
      : filters.severity.filter(s => s !== severity);
    
    onFiltersChange({ ...filters, severity: newSeverity });
  };

  const handleSourceTypeChange = (sourceType: SourceType, checked: boolean) => {
    const newSourceTypes = checked
      ? [...filters.sourceTypes, sourceType]
      : filters.sourceTypes.filter(s => s !== sourceType);
    
    onFiltersChange({ ...filters, sourceTypes: newSourceTypes });
  };

  const totalEvents = events.length;
  const criticalEvents = events.filter(e => e.severity === 'critical').length;

  return (
    <div className="w-80 bg-dashboard-sidebar border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Globe className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">GeoPulse</h1>
            <p className="text-xs text-muted-foreground">OSINT Geopolitical Dashboard</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Filters
          </h2>

          {/* Region Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Region</Label>
            <Select 
              value={filters.region} 
              onValueChange={(value: Region) => onFiltersChange({ ...filters, region: value })}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Severity Filter */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Severity</Label>
            {severityLevels.map(level => (
              <div key={level.value} className="flex items-center space-x-3">
                <Checkbox
                  id={level.value}
                  checked={filters.severity.includes(level.value)}
                  onCheckedChange={(checked) => handleSeverityChange(level.value, checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${level.color}`} />
                  <Label htmlFor={level.value} className="text-sm font-medium text-foreground">
                    {level.label}
                  </Label>
                </div>
              </div>
            ))}
          </div>

          {/* Time Range Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Time Range
            </Label>
            <Select 
              value={filters.timeRange} 
              onValueChange={(value: any) => onFiltersChange({ ...filters, timeRange: value })}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Source Type Filter */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Radio className="w-3 h-3" />
              Source Type
            </Label>
            {sourceTypes.map(source => (
              <div key={source.value} className="flex items-center space-x-3">
                <Checkbox
                  id={source.value}
                  checked={filters.sourceTypes.includes(source.value)}
                  onCheckedChange={(checked) => handleSourceTypeChange(source.value, checked as boolean)}
                />
                <Label htmlFor={source.value} className="text-sm font-medium text-foreground">
                  {source.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-sm font-semibold text-foreground">Analytics</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-card border-border">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Total Events</div>
                <div className="text-2xl font-bold text-foreground">{totalEvents}</div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card border-border">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Critical</div>
                <div className="text-2xl font-bold text-destructive">{criticalEvents}</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-secondary-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">Analyst</div>
            <div className="text-xs text-muted-foreground">Geopolitical Team</div>
          </div>
        </div>
      </div>
    </div>
  );
};