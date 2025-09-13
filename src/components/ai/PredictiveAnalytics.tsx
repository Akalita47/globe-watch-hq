import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Event } from '@/types/events';
import { Brain, TrendingUp, AlertTriangle, Clock, Zap, BarChart3 } from 'lucide-react';

interface PredictiveAnalyticsProps {
  events: Event[];
}

interface PredictionModel {
  id: string;
  type: 'escalation' | 'conflict' | 'economic' | 'cyber' | 'stability';
  confidence: number;
  timeframe: string;
  description: string;
  indicators: string[];
  region: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface TrendAnalysis {
  category: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  changeRate: number;
  prediction: string;
  confidence: number;
}

const generatePredictions = (events: Event[]): PredictionModel[] => {
  const predictions: PredictionModel[] = [];
  
  // Group events by region and analyze patterns
  const regionMap = new Map<string, Event[]>();
  events.forEach(event => {
    const country = event.location.country;
    if (!regionMap.has(country)) regionMap.set(country, []);
    regionMap.get(country)!.push(event);
  });
  
  regionMap.forEach((regionEvents, country) => {
    const criticalEvents = regionEvents.filter(e => e.severity === 'critical').length;
    const totalEvents = regionEvents.length;
    const conflictKeywords = ['conflict', 'military', 'war', 'invasion', 'missile', 'attack'];
    const cyberKeywords = ['cyber', 'hack', 'breach', 'malware', 'ransomware'];
    const economicKeywords = ['economic', 'sanction', 'trade', 'inflation', 'crisis'];
    
    const conflictScore = regionEvents.reduce((score, event) => {
      const text = `${event.title} ${event.description}`.toLowerCase();
      return score + conflictKeywords.reduce((s, keyword) => s + (text.includes(keyword) ? 1 : 0), 0);
    }, 0);
    
    const cyberScore = regionEvents.reduce((score, event) => {
      const text = `${event.title} ${event.description}`.toLowerCase();
      return score + cyberKeywords.reduce((s, keyword) => s + (text.includes(keyword) ? 1 : 0), 0);
    }, 0);
    
    const economicScore = regionEvents.reduce((score, event) => {
      const text = `${event.title} ${event.description}`.toLowerCase();
      return score + economicKeywords.reduce((s, keyword) => s + (text.includes(keyword) ? 1 : 0), 0);
    }, 0);
    
    // Generate conflict escalation prediction
    if (conflictScore > 2 || criticalEvents > 2) {
      predictions.push({
        id: `conflict-${country}`,
        type: 'escalation',
        confidence: Math.min(85, 40 + (conflictScore * 10) + (criticalEvents * 15)),
        timeframe: '24-72 hours',
        description: `High probability of conflict escalation in ${country}`,
        indicators: ['Multiple military events', 'Critical severity alerts', 'Pattern recognition'],
        region: country,
        riskLevel: conflictScore > 4 ? 'critical' : 'high'
      });
    }
    
    // Generate cyber threat prediction
    if (cyberScore > 1) {
      predictions.push({
        id: `cyber-${country}`,
        type: 'cyber',
        confidence: Math.min(90, 30 + (cyberScore * 20)),
        timeframe: '6-24 hours',
        description: `Increased cyber activity expected in ${country}`,
        indicators: ['Cyber event clusters', 'Infrastructure targeting', 'Attack pattern analysis'],
        region: country,
        riskLevel: cyberScore > 3 ? 'high' : 'medium'
      });
    }
    
    // Generate economic impact prediction
    if (economicScore > 1) {
      predictions.push({
        id: `economic-${country}`,
        type: 'economic',
        confidence: Math.min(75, 25 + (economicScore * 15)),
        timeframe: '1-7 days',
        description: `Economic instability indicators in ${country}`,
        indicators: ['Economic event frequency', 'Market volatility signals', 'Policy changes'],
        region: country,
        riskLevel: economicScore > 2 ? 'medium' : 'low'
      });
    }
  });
  
  // Global stability prediction
  const globalCritical = events.filter(e => e.severity === 'critical').length;
  if (globalCritical > 5) {
    predictions.push({
      id: 'global-stability',
      type: 'stability',
      confidence: Math.min(80, 50 + (globalCritical * 5)),
      timeframe: '48-96 hours',
      description: 'Global stability concerns due to multiple critical events',
      indicators: ['Critical event threshold', 'Multi-region impact', 'Cascading effects model'],
      region: 'Global',
      riskLevel: globalCritical > 8 ? 'critical' : 'high'
    });
  }
  
  return predictions.sort((a, b) => b.confidence - a.confidence);
};

const analyzeTrends = (events: Event[]): TrendAnalysis[] => {
  const now = new Date();
  const last24h = events.filter(e => (now.getTime() - e.timestamp.getTime()) < 24 * 60 * 60 * 1000);
  const prev24h = events.filter(e => {
    const diff = now.getTime() - e.timestamp.getTime();
    return diff >= 24 * 60 * 60 * 1000 && diff < 48 * 60 * 60 * 1000;
  });
  
  const categories = ['critical', 'cyber', 'military', 'economic'];
  
  return categories.map(category => {
    let current = 0, previous = 0;
    
    if (category === 'critical') {
      current = last24h.filter(e => e.severity === 'critical').length;
      previous = prev24h.filter(e => e.severity === 'critical').length;
    } else {
      const keyword = category === 'cyber' ? ['cyber', 'hack'] : 
                     category === 'military' ? ['military', 'conflict'] :
                     ['economic', 'sanction'];
      
      current = last24h.filter(e => 
        keyword.some(k => `${e.title} ${e.description}`.toLowerCase().includes(k))
      ).length;
      previous = prev24h.filter(e => 
        keyword.some(k => `${e.title} ${e.description}`.toLowerCase().includes(k))
      ).length;
    }
    
    const changeRate = previous > 0 ? ((current - previous) / previous) * 100 : 
                      current > 0 ? 100 : 0;
    
    const trend: 'increasing' | 'decreasing' | 'stable' = 
      Math.abs(changeRate) < 10 ? 'stable' :
      changeRate > 0 ? 'increasing' : 'decreasing';
    
    const prediction = trend === 'increasing' ? 
      `${category} events likely to continue rising` :
      trend === 'decreasing' ?
      `${category} events showing decline` :
      `${category} events remaining stable`;
    
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      trend,
      changeRate: Math.abs(changeRate),
      prediction,
      confidence: Math.min(85, 60 + Math.abs(changeRate))
    };
  });
};

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ events }) => {
  const { predictions, trends } = useMemo(() => ({
    predictions: generatePredictions(events),
    trends: analyzeTrends(events)
  }), [events]);
  
  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white border-red-600';
      case 'high': return 'bg-orange-500 text-white border-orange-600';
      case 'medium': return 'bg-yellow-500 text-white border-yellow-600';
      default: return 'bg-green-500 text-white border-green-600';
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing': return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Predictions Dashboard */}
      <Card className="p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-foreground">AI Predictive Intelligence</h3>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            ML Powered
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {predictions.slice(0, 4).map((prediction) => (
            <div
              key={prediction.id}
              className="p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getRiskColor(prediction.riskLevel)}`}
                >
                  {prediction.riskLevel.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {prediction.timeframe}
                </div>
              </div>
              
              <h4 className="text-sm font-medium text-foreground mb-1">
                {prediction.description}
              </h4>
              
              <div className="text-xs text-muted-foreground mb-2">
                Region: {prediction.region}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Confidence
                </div>
                <div className="text-xs font-bold text-blue-600">
                  {prediction.confidence.toFixed(0)}%
                </div>
              </div>
              <Progress value={prediction.confidence} className="h-1 mt-1" />
            </div>
          ))}
        </div>
      </Card>

      {/* Trend Analysis */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-purple-500" />
          <h4 className="text-sm font-medium text-foreground">24h Trend Analysis</h4>
        </div>
        
        <div className="space-y-3">
          {trends.map((trend) => (
            <div
              key={trend.category}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50"
            >
              <div className="flex items-center gap-3">
                {getTrendIcon(trend.trend)}
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {trend.category}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trend.prediction}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-bold text-foreground">
                  {trend.changeRate > 0 ? '+' : ''}{trend.changeRate.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {trend.confidence.toFixed(0)}% confidence
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Advanced Predictions */}
      {predictions.length > 4 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-medium text-foreground">Extended Forecasts</h4>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {predictions.slice(4).map((prediction) => (
              <div
                key={prediction.id}
                className="flex items-center justify-between p-2 rounded-lg bg-background/30"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {prediction.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {prediction.region} • {prediction.timeframe} • {prediction.confidence.toFixed(0)}% confidence
                  </div>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={`text-xs ml-2 ${getRiskColor(prediction.riskLevel)}`}
                >
                  {prediction.type.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};