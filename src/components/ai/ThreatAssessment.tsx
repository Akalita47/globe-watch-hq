import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Event, SeverityLevel } from '@/types/events';
import { Shield, AlertCircle, TrendingUp, Target, Zap } from 'lucide-react';

interface ThreatAssessmentProps {
  events: Event[];
}

interface ThreatMetrics {
  overallRisk: number;
  criticalThreats: number;
  emergingThreats: number;
  geopoliticalTension: number;
  cyberSecurity: number;
  economicRisk: number;
}

interface RegionalRisk {
  region: string;
  riskScore: number;
  threatCount: number;
  primaryThreats: string[];
}

const calculateThreatScore = (event: Event): number => {
  let score = 0;
  
  // Base severity scoring
  const severityScores = { critical: 100, high: 75, medium: 50, low: 25 };
  score += severityScores[event.severity];
  
  // Threat type multipliers
  const title = event.title.toLowerCase();
  const description = event.description.toLowerCase();
  const content = `${title} ${description}`;
  
  if (content.includes('nuclear') || content.includes('missile')) score *= 1.5;
  if (content.includes('cyber') || content.includes('hack')) score *= 1.3;
  if (content.includes('terrorist') || content.includes('attack')) score *= 1.4;
  if (content.includes('military') || content.includes('invasion')) score *= 1.3;
  if (content.includes('economic') || content.includes('sanctions')) score *= 1.2;
  if (content.includes('pandemic') || content.includes('health')) score *= 1.25;
  
  // Time decay (recent events are more threatening)
  const hoursOld = (Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60);
  const timeFactor = Math.max(0.5, 1 - (hoursOld / 168)); // Decay over a week
  
  return Math.min(score * timeFactor, 150); // Cap at 150
};

const getCountryRisk = (country: string, events: Event[]): number => {
  const countryEvents = events.filter(e => e.location.country === country);
  if (countryEvents.length === 0) return 0;
  
  const totalScore = countryEvents.reduce((sum, event) => sum + calculateThreatScore(event), 0);
  return Math.min(totalScore / countryEvents.length, 100);
};

export const ThreatAssessment: React.FC<ThreatAssessmentProps> = ({ events }) => {
  const threatAnalysis = useMemo(() => {
    const threatScores = events.map(event => ({
      ...event,
      threatScore: calculateThreatScore(event)
    }));
    
    const criticalThreats = threatScores.filter(e => e.threatScore > 100).length;
    const emergingThreats = threatScores.filter(e => e.threatScore > 75 && e.threatScore <= 100).length;
    
    // Calculate category risks
    const cyberEvents = threatScores.filter(e => 
      e.title.toLowerCase().includes('cyber') || 
      e.description.toLowerCase().includes('hack') ||
      e.description.toLowerCase().includes('breach')
    );
    
    const geopoliticalEvents = threatScores.filter(e => 
      e.title.toLowerCase().includes('militar') || 
      e.description.toLowerCase().includes('conflict') ||
      e.description.toLowerCase().includes('tension')
    );
    
    const economicEvents = threatScores.filter(e => 
      e.title.toLowerCase().includes('economic') || 
      e.description.toLowerCase().includes('sanction') ||
      e.description.toLowerCase().includes('trade')
    );
    
    // Regional analysis
    const countries = [...new Set(events.map(e => e.location.country))];
    const regionalRisks: RegionalRisk[] = countries.map(country => {
      const countryEvents = threatScores.filter(e => e.location.country === country);
      const riskScore = getCountryRisk(country, events);
      
      // Identify primary threats for this region
      const threatTypes = new Map<string, number>();
      countryEvents.forEach(event => {
        const content = `${event.title} ${event.description}`.toLowerCase();
        if (content.includes('cyber')) threatTypes.set('Cyber', (threatTypes.get('Cyber') || 0) + 1);
        if (content.includes('militar') || content.includes('conflict')) threatTypes.set('Military', (threatTypes.get('Military') || 0) + 1);
        if (content.includes('economic')) threatTypes.set('Economic', (threatTypes.get('Economic') || 0) + 1);
        if (content.includes('terror')) threatTypes.set('Terrorism', (threatTypes.get('Terrorism') || 0) + 1);
      });
      
      const primaryThreats = Array.from(threatTypes.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([type]) => type);
      
      return {
        region: country,
        riskScore,
        threatCount: countryEvents.length,
        primaryThreats
      };
    }).sort((a, b) => b.riskScore - a.riskScore);
    
    const overallRisk = threatScores.reduce((sum, e) => sum + e.threatScore, 0) / threatScores.length;
    
    const metrics: ThreatMetrics = {
      overallRisk,
      criticalThreats,
      emergingThreats,
      geopoliticalTension: geopoliticalEvents.reduce((sum, e) => sum + e.threatScore, 0) / Math.max(geopoliticalEvents.length, 1),
      cyberSecurity: cyberEvents.reduce((sum, e) => sum + e.threatScore, 0) / Math.max(cyberEvents.length, 1),
      economicRisk: economicEvents.reduce((sum, e) => sum + e.threatScore, 0) / Math.max(economicEvents.length, 1)
    };
    
    return {
      metrics,
      regionalRisks: regionalRisks.slice(0, 8),
      highestThreats: threatScores.sort((a, b) => b.threatScore - a.threatScore).slice(0, 5)
    };
  }, [events]);
  
  const getRiskColor = (score: number): string => {
    if (score > 80) return 'text-red-600 bg-red-50 border-red-200';
    if (score > 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score > 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };
  
  const getRiskLevel = (score: number): string => {
    if (score > 80) return 'CRITICAL';
    if (score > 60) return 'HIGH';
    if (score > 40) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="space-y-4">
      {/* Overall Threat Dashboard */}
      <Card className="p-4 bg-gradient-to-r from-red-500/5 to-orange-500/5 border-red-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-red-600" />
          <h3 className="text-sm font-semibold text-foreground">AI Threat Assessment</h3>
          <Badge 
            variant="outline" 
            className={getRiskColor(threatAnalysis.metrics.overallRisk)}
          >
            {getRiskLevel(threatAnalysis.metrics.overallRisk)} RISK
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Overall Risk</span>
              <span className="text-sm font-medium">{threatAnalysis.metrics.overallRisk.toFixed(1)}%</span>
            </div>
            <Progress value={threatAnalysis.metrics.overallRisk} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cyber Security</span>
              <span className="text-sm font-medium">{threatAnalysis.metrics.cyberSecurity.toFixed(1)}%</span>
            </div>
            <Progress value={threatAnalysis.metrics.cyberSecurity} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Geopolitical</span>
              <span className="text-sm font-medium">{threatAnalysis.metrics.geopoliticalTension.toFixed(1)}%</span>
            </div>
            <Progress value={threatAnalysis.metrics.geopoliticalTension} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Economic</span>
              <span className="text-sm font-medium">{threatAnalysis.metrics.economicRisk.toFixed(1)}%</span>
            </div>
            <Progress value={threatAnalysis.metrics.economicRisk} className="h-2" />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>{threatAnalysis.metrics.criticalThreats} Critical</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span>{threatAnalysis.metrics.emergingThreats} Emerging</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Regional Risk Assessment */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-orange-500" />
          <h4 className="text-sm font-medium text-foreground">Regional Risk Analysis</h4>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {threatAnalysis.regionalRisks.map((region) => (
            <div
              key={region.region}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{region.region}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRiskColor(region.riskScore)}`}
                  >
                    {getRiskLevel(region.riskScore)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {region.threatCount} events • Primary: {region.primaryThreats.join(', ') || 'None'}
                </div>
                <Progress value={region.riskScore} className="h-1 mt-1" />
              </div>
              
              <div className="text-sm font-mono text-muted-foreground w-12 text-right">
                {region.riskScore.toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Threats */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-red-500" />
          <h4 className="text-sm font-medium text-foreground">Highest Priority Threats</h4>
        </div>
        
        <div className="space-y-2">
          {threatAnalysis.highestThreats.map((threat, index) => (
            <div
              key={threat.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-background/50"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {threat.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {threat.location.country} • {threat.source.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-red-600">
                  {threat.threatScore.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Threat Score
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};