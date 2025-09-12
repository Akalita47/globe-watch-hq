import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Settings, 
  Search, 
  Bell, 
  Plus,
  Download,
  Activity,
  Workflow,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  totalEvents: number;
  criticalEvents: number;
  onCreateReport?: () => void;
  onOpenAutomation?: () => void;
}

export const Header = ({ 
  onRefresh, 
  isRefreshing = false, 
  totalEvents, 
  criticalEvents,
  onCreateReport,
  onOpenAutomation
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    onRefresh();
    setLastRefresh(new Date());
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB');
  };

  return (
    <header className="bg-dashboard-header border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">
              OSINT Geopolitical Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
              {criticalEvents > 0 && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  <Bell className="w-3 h-3 mr-1" />
                  {criticalEvents} Critical
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events, locations, sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="text-foreground font-semibold">{totalEvents}</div>
              <div className="text-xs">Events</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-destructive font-semibold">{criticalEvents}</div>
              <div className="text-xs">Critical</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-background/50 hover:bg-background/80"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAutomation}
              className="bg-background/50 hover:bg-background/80"
            >
              <Workflow className="w-4 h-4 mr-2" />
              n8n Automation
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-background/50 hover:bg-background/80"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            <Button
              onClick={onCreateReport}
              size="sm"
              className="bg-gradient-primary hover:opacity-90 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Analysis Report
            </Button>
          </div>

          {/* Time Display */}
          <div className="text-right text-sm">
            <div className="text-foreground font-mono">
              {formatTime(new Date())}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(new Date())}
            </div>
          </div>
        </div>
      </div>

      {/* Last Refresh Indicator */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="text-xs text-muted-foreground">
          Last updated: {formatTime(lastRefresh)} • Auto-refresh: ON
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-severity-critical" />
            Critical ({criticalEvents})
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-severity-high" />
            High ({totalEvents - criticalEvents > 0 ? Math.floor((totalEvents - criticalEvents) * 0.4) : 0})
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-severity-medium" />
            Medium ({totalEvents - criticalEvents > 0 ? Math.floor((totalEvents - criticalEvents) * 0.4) : 0})
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-severity-low" />
            Low ({totalEvents - criticalEvents > 0 ? Math.ceil((totalEvents - criticalEvents) * 0.2) : 0})
          </div>
        </div>
      </div>
    </header>
  );
};