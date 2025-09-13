import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { N8nWebhook, AutomationRule } from '@/types/automation';
import { Event } from '@/types/events';
import { 
  Brain, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Globe, 
  Clock,
  Target,
  Activity
} from 'lucide-react';

interface IntelligentAutomationProps {
  webhooks: N8nWebhook[];
  events: Event[];
  rules: AutomationRule[];
}

interface ThreatPattern {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  lastDetected?: Date;
}

interface AutoTrigger {
  id: string;
  name: string;
  pattern: ThreatPattern;
  webhook: N8nWebhook;
  isActive: boolean;
  triggerCount: number;
  lastTriggered?: Date;
}

export const IntelligentAutomation = ({ webhooks, events, rules }: IntelligentAutomationProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [threatPatterns, setThreatPatterns] = useState<ThreatPattern[]>([
    {
      id: '1',
      name: 'Coordinated Cyber Attacks',
      description: 'Multiple cyber incidents in related infrastructure sectors',
      conditions: ['keyword:cyber', 'keyword:infrastructure', 'severity:critical', 'timeframe:6h'],
      severity: 'critical',
      confidence: 87,
      lastDetected: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Regional Political Escalation',
      description: 'Increasing political tension in geographic region',
      conditions: ['severity:high', 'region:same', 'count:greater_than_3', 'timeframe:24h'],
      severity: 'high',
      confidence: 74,
      lastDetected: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Economic Warfare Indicators',
      description: 'Patterns suggesting economic warfare or sanctions',
      conditions: ['keyword:sanctions', 'keyword:economic', 'keyword:trade'],
      severity: 'medium',
      confidence: 62
    }
  ]);

  const [autoTriggers, setAutoTriggers] = useState<AutoTrigger[]>([]);
  const { toast } = useToast();

  // Intelligent pattern analysis
  const analyzeThreats = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI-powered threat analysis
    setTimeout(() => {
      const updatedPatterns = threatPatterns.map(pattern => {
        const matchingEvents = events.filter(event => {
          // Simulate pattern matching logic
          if (pattern.id === '1') {
            return event.title.toLowerCase().includes('cyber') && event.severity === 'critical';
          }
          if (pattern.id === '2') {
            return event.severity === 'high' && event.location.country.includes('Ukraine');
          }
          return false;
        });

        return {
          ...pattern,
          confidence: Math.min(95, pattern.confidence + (matchingEvents.length * 5)),
          lastDetected: matchingEvents.length > 0 ? new Date() : pattern.lastDetected
        };
      });

      setThreatPatterns(updatedPatterns);
      setIsAnalyzing(false);

      // Check for high-confidence threats and trigger webhooks
      updatedPatterns.forEach(pattern => {
        if (pattern.confidence > 80 && pattern.lastDetected) {
          triggerIntelligentWebhook(pattern);
        }
      });

      toast({
        title: "Threat Analysis Complete",
        description: `Analyzed ${events.length} events and identified ${updatedPatterns.filter(p => p.confidence > 70).length} high-confidence patterns`,
      });
    }, 2000);
  };

  const triggerIntelligentWebhook = async (pattern: ThreatPattern) => {
    if (webhooks.length === 0) return;

    const webhook = webhooks[0]; // Use first available webhook for demo
    
    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          intelligence_alert: true,
          pattern: {
            name: pattern.name,
            description: pattern.description,
            severity: pattern.severity,
            confidence: pattern.confidence
          },
          timestamp: new Date().toISOString(),
          events: events.slice(0, 5), // Send recent events
          analysis: {
            threat_level: pattern.severity,
            confidence_score: pattern.confidence,
            recommendation: pattern.severity === 'critical' ? 'Immediate action required' : 'Monitor closely'
          }
        })
      });

      toast({
        title: "Intelligent Alert Sent",
        description: `n8n workflow triggered for ${pattern.name} (${pattern.confidence}% confidence)`,
      });
    } catch (error) {
      console.error('Failed to trigger intelligent webhook:', error);
    }
  };

  // Auto-analysis every 10 minutes
  useEffect(() => {
    const interval = setInterval(analyzeThreats, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [events]);

  const getPatternStatus = (confidence: number) => {
    if (confidence >= 80) return { status: 'Critical', color: 'destructive' };
    if (confidence >= 60) return { status: 'Warning', color: 'default' };
    return { status: 'Monitoring', color: 'secondary' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Intelligent Automation</h2>
            <p className="text-sm text-muted-foreground">AI-powered threat pattern recognition and automated response</p>
          </div>
        </div>
        
        <Button 
          onClick={analyzeThreats}
          disabled={isAnalyzing}
          className="bg-gradient-primary"
        >
          <Brain className="w-4 h-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </Button>
      </div>

      {/* Intelligence Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-lg font-semibold text-foreground">{threatPatterns.length}</div>
              <div className="text-sm text-muted-foreground">Active Patterns</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <div>
              <div className="text-lg font-semibold text-foreground">
                {threatPatterns.filter(p => p.confidence > 70).length}
              </div>
              <div className="text-sm text-muted-foreground">High Confidence</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-lg font-semibold text-foreground">
                {autoTriggers.reduce((sum, trigger) => sum + trigger.triggerCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Auto Triggers</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            <div>
              <div className="text-lg font-semibold text-foreground">
                {Math.round(threatPatterns.reduce((sum, p) => sum + p.confidence, 0) / threatPatterns.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Threat Patterns */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Threat Patterns</h3>
        <div className="space-y-3">
          {threatPatterns.map(pattern => {
            const { status, color } = getPatternStatus(pattern.confidence);
            
            return (
              <Card key={pattern.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-medium text-foreground">{pattern.name}</h4>
                      <Badge variant={color as any}>{status}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {pattern.confidence}% Confidence
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{pattern.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-primary" />
                        <span>Severity: {pattern.severity}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>
                          Last detected: {pattern.lastDetected?.toLocaleString() || 'Never'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-2">Detection Conditions:</div>
                      <div className="flex flex-wrap gap-2">
                        {pattern.conditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => triggerIntelligentWebhook(pattern)}
                      disabled={webhooks.length === 0}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Trigger Now
                    </Button>
                  </div>
                </div>
                
                {/* Confidence Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Confidence Level</span>
                    <span>{pattern.confidence}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        pattern.confidence >= 80 ? 'bg-red-500' :
                        pattern.confidence >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${pattern.confidence}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Automated Response Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Automated Response Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto-trigger on high confidence (&gt;80%)</Label>
              <p className="text-xs text-muted-foreground">Automatically send alerts when patterns exceed confidence threshold</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Real-time pattern analysis</Label>
              <p className="text-xs text-muted-foreground">Continuously analyze incoming events for threat patterns</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center gap-4">
            <div>
              <Label className="text-sm font-medium">Analysis frequency</Label>
              <p className="text-xs text-muted-foreground">How often to run intelligent analysis</p>
            </div>
            <Select defaultValue="10min">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5min">5 minutes</SelectItem>
                <SelectItem value="10min">10 minutes</SelectItem>
                <SelectItem value="30min">30 minutes</SelectItem>
                <SelectItem value="1hr">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};