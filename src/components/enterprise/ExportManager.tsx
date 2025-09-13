import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Event } from '@/types/events';
import { Download, FileText, Image, BarChart3, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportManagerProps {
  events: Event[];
  isVisible: boolean;
  onClose: () => void;
}

interface ExportConfig {
  format: 'pdf' | 'csv' | 'json' | 'xlsx';
  includeAnalytics: boolean;
  includeThreatAssessment: boolean;
  includePredictions: boolean;
  timeRange: '24h' | '7d' | '30d' | 'all';
  regions: string[];
  severityLevels: string[];
}

export const ExportManager: React.FC<ExportManagerProps> = ({ events, isVisible, onClose }) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<ExportConfig>({
    format: 'pdf',
    includeAnalytics: true,
    includeThreatAssessment: true,
    includePredictions: true,
    timeRange: '24h',
    regions: [],
    severityLevels: ['critical', 'high']
  });
  const [isExporting, setIsExporting] = useState(false);

  if (!isVisible) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const filename = `osint-report-${new Date().toISOString().split('T')[0]}.${config.format}`;
      
      // In a real implementation, this would generate and download the actual file
      const exportData = {
        metadata: {
          generated: new Date().toISOString(),
          format: config.format,
          totalEvents: events.length,
          timeRange: config.timeRange,
          includesAnalytics: config.includeAnalytics,
          includesThreatAssessment: config.includeThreatAssessment,
          includesPredictions: config.includePredictions
        },
        events: events.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          severity: event.severity,
          location: event.location,
          source: event.source,
          timestamp: event.timestamp,
          tags: event.tags
        })),
        analytics: config.includeAnalytics ? {
          totalEvents: events.length,
          criticalEvents: events.filter(e => e.severity === 'critical').length,
          regionDistribution: [...new Set(events.map(e => e.location.country))].length,
          sourceTypes: [...new Set(events.map(e => e.source.type))]
        } : null
      };

      // Create and download blob (simulation)
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: config.format === 'json' ? 'application/json' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Completed",
        description: `Successfully exported ${events.length} events as ${config.format.toUpperCase()}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the export. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const regions = [...new Set(events.map(e => e.location.country))];
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Export Intelligence Report</h2>
              <p className="text-sm text-muted-foreground">Generate comprehensive reports for analysis and sharing</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Export Format */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Export Format</label>
              <Select value={config.format} onValueChange={(value: any) => setConfig({...config, format: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      PDF Report (Recommended)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      CSV Data Export
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      JSON Raw Data
                    </div>
                  </SelectItem>
                  <SelectItem value="xlsx">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Excel Spreadsheet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Time Range</label>
              <Select value={config.timeRange} onValueChange={(value: any) => setConfig({...config, timeRange: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Include Options */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Report Components</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="analytics"
                    checked={config.includeAnalytics}
                    onCheckedChange={(checked) => setConfig({...config, includeAnalytics: !!checked})}
                  />
                  <label htmlFor="analytics" className="text-sm text-foreground">
                    Include Analytics Dashboard
                  </label>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="threats"
                    checked={config.includeThreatAssessment}
                    onCheckedChange={(checked) => setConfig({...config, includeThreatAssessment: !!checked})}
                  />
                  <label htmlFor="threats" className="text-sm text-foreground">
                    Include Threat Assessment
                  </label>
                  <Badge variant="secondary" className="text-xs">AI Powered</Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="predictions"
                    checked={config.includePredictions}
                    onCheckedChange={(checked) => setConfig({...config, includePredictions: !!checked})}
                  />
                  <label htmlFor="predictions" className="text-sm text-foreground">
                    Include Predictive Analysis
                  </label>
                  <Badge variant="secondary" className="text-xs">ML Models</Badge>
                </div>
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Severity Levels</label>
              <div className="flex flex-wrap gap-2">
                {['critical', 'high', 'medium', 'low'].map(severity => (
                  <div key={severity} className="flex items-center space-x-2">
                    <Checkbox
                      id={severity}
                      checked={config.severityLevels.includes(severity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setConfig({...config, severityLevels: [...config.severityLevels, severity]});
                        } else {
                          setConfig({...config, severityLevels: config.severityLevels.filter(s => s !== severity)});
                        }
                      }}
                    />
                    <label htmlFor={severity} className="text-sm text-foreground capitalize">
                      {severity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Summary */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Export Summary</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• {events.length} events will be exported</div>
                <div>• Format: {config.format.toUpperCase()}</div>
                <div>• Time range: {config.timeRange}</div>
                <div>• Components: {[
                  config.includeAnalytics && 'Analytics',
                  config.includeThreatAssessment && 'Threat Assessment',
                  config.includePredictions && 'Predictions'
                ].filter(Boolean).join(', ')}</div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="flex-1"
              >
                {isExporting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Generating Export...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};