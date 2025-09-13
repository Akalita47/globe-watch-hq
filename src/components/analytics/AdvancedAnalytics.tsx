import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Event } from '@/types/events';
import { SentimentAnalyzer } from '../ai/SentimentAnalyzer';
import { ThreatAssessment } from '../ai/ThreatAssessment';
import { PredictiveAnalytics } from '../ai/PredictiveAnalytics';
import { Brain, Shield, TrendingUp, BarChart3, Zap, Globe } from 'lucide-react';

interface AdvancedAnalyticsProps {
  events: Event[];
  isVisible: boolean;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ events, isVisible }) => {
  if (!isVisible) return null;

  return (
    <Card className="absolute inset-4 bg-background/95 backdrop-blur-sm border shadow-2xl z-50 animate-fade-in">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI Intelligence Analytics</h2>
              <p className="text-sm text-muted-foreground">Advanced threat analysis and predictive modeling</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="sentiment" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="sentiment" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Sentiment</span>
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Threats</span>
            </TabsTrigger>
            <TabsTrigger value="predictive" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Predictive</span>
            </TabsTrigger>
            <TabsTrigger value="geospatial" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Geospatial</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="sentiment" className="h-full mt-0">
              <div className="h-full overflow-y-auto">
                <SentimentAnalyzer events={events} />
              </div>
            </TabsContent>

            <TabsContent value="threats" className="h-full mt-0">
              <div className="h-full overflow-y-auto">
                <ThreatAssessment events={events} />
              </div>
            </TabsContent>

            <TabsContent value="predictive" className="h-full mt-0">
              <div className="h-full overflow-y-auto">
                <PredictiveAnalytics events={events} />
              </div>
            </TabsContent>

            <TabsContent value="geospatial" className="h-full mt-0">
              <div className="h-full overflow-y-auto">
                <GeospatialAnalytics events={events} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Card>
  );
};

const GeospatialAnalytics: React.FC<{ events: Event[] }> = ({ events }) => {
  const regionAnalysis = React.useMemo(() => {
    const regions = events.reduce((acc, event) => {
      const country = event.location.country;
      if (!acc[country]) {
        acc[country] = { total: 0, critical: 0, high: 0, coordinates: event.location.coordinates };
      }
      acc[country].total++;
      if (event.severity === 'critical') acc[country].critical++;
      if (event.severity === 'high') acc[country].high++;
      return acc;
    }, {} as Record<string, { total: number; critical: number; high: number; coordinates: [number, number] }>);

    return Object.entries(regions)
      .map(([country, data]) => ({
        country,
        ...data,
        riskScore: (data.critical * 3 + data.high * 2) / data.total
      }))
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [events]);

  const hotspots = regionAnalysis.slice(0, 5);
  const totalHotspots = hotspots.length;
  const averageRisk = hotspots.reduce((sum, h) => sum + h.riskScore, 0) / totalHotspots;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-r from-green-500/5 to-blue-500/5 border-green-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-green-600" />
          <h3 className="text-sm font-semibold text-foreground">Geospatial Intelligence</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalHotspots}</div>
            <div className="text-xs text-muted-foreground">Active Hotspots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{averageRisk.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Avg Risk Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{events.length}</div>
            <div className="text-xs text-muted-foreground">Total Events</div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-500" />
          <h4 className="text-sm font-medium text-foreground">Regional Hotspots</h4>
        </div>
        
        <div className="space-y-3">
          {hotspots.map((region, index) => (
            <div
              key={region.country}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {region.country}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {region.total} events • {region.critical} critical • {region.high} high
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-bold text-red-600">
                  {region.riskScore.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Risk Score
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Clustering Analysis</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Event Density</div>
            <div className="font-semibold">High concentration in {hotspots[0]?.country || 'N/A'}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Spread Pattern</div>
            <div className="font-semibold">{regionAnalysis.length > 10 ? 'Global' : 'Regional'}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Risk Gradient</div>
            <div className="font-semibold">{averageRisk > 2 ? 'Steep' : 'Moderate'}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Coverage</div>
            <div className="font-semibold">{regionAnalysis.length} countries</div>
          </div>
        </div>
      </Card>
    </div>
  );
};