import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { N8nWebhook, WorkflowTrigger } from '@/types/automation';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface WorkflowMonitorProps {
  webhooks: N8nWebhook[];
}

export const WorkflowMonitor = ({ webhooks }: WorkflowMonitorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [webhookFilter, setWebhookFilter] = useState('all');

  // Mock trigger history data
  const [triggerHistory] = useState<WorkflowTrigger[]>([
    {
      webhookId: '1',
      eventData: { 
        title: 'Critical infrastructure cyber attack in Ukraine', 
        severity: 'critical',
        region: 'Europe'
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      success: true
    },
    {
      webhookId: '1',
      eventData: { 
        title: 'Political unrest in Myanmar escalates', 
        severity: 'high',
        region: 'Asia'
      },
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      success: true
    },
    {
      webhookId: '2',
      eventData: { 
        title: 'Economic sanctions announced', 
        severity: 'medium',
        region: 'Global'
      },
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      success: false,
      error: 'Webhook timeout after 30 seconds'
    },
    {
      webhookId: '1',
      eventData: { 
        title: 'Border skirmish reported', 
        severity: 'high',
        region: 'Middle East'
      },
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      success: true
    },
    {
      webhookId: '2',
      eventData: { 
        title: 'Intelligence report declassified', 
        severity: 'medium',
        region: 'North America'
      },
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      success: true
    }
  ]);

  const getWebhookName = (webhookId: string) => {
    return webhooks.find(w => w.id === webhookId)?.name || 'Unknown Webhook';
  };

  const filteredTriggers = triggerHistory.filter(trigger => {
    const matchesSearch = searchQuery === '' || 
      trigger.eventData.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getWebhookName(trigger.webhookId).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'success' && trigger.success) ||
      (statusFilter === 'error' && !trigger.success);
    
    const matchesWebhook = webhookFilter === 'all' || trigger.webhookId === webhookFilter;
    
    return matchesSearch && matchesStatus && matchesWebhook;
  });

  const successCount = triggerHistory.filter(t => t.success).length;
  const errorCount = triggerHistory.filter(t => !t.success).length;
  const successRate = triggerHistory.length > 0 ? (successCount / triggerHistory.length) * 100 : 0;

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Workflow Monitor</h2>
          <p className="text-sm text-muted-foreground">Real-time monitoring of n8n workflow executions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <div>
              <div className="text-lg font-semibold text-foreground">{triggerHistory.length}</div>
              <div className="text-sm text-muted-foreground">Total Executions</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-lg font-semibold text-foreground">{successCount}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <div>
              <div className="text-lg font-semibold text-foreground">{errorCount}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-lg font-semibold text-foreground">{successRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search executions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Failed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={webhookFilter} onValueChange={setWebhookFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Webhooks</SelectItem>
            {webhooks.map(webhook => (
              <SelectItem key={webhook.id} value={webhook.id}>
                {webhook.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Execution History */}
      <div className="space-y-3">
        {filteredTriggers.map((trigger, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {trigger.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <Badge variant="outline">
                    {getWebhookName(trigger.webhookId)}
                  </Badge>
                  <Badge variant={trigger.success ? "default" : "destructive"}>
                    {trigger.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
                
                <h4 className="font-medium text-foreground mb-2">
                  {trigger.eventData.title}
                </h4>
                
                {trigger.error && (
                  <p className="text-sm text-red-500 mb-2">
                    Error: {trigger.error}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Severity: {trigger.eventData.severity}</span>
                  <span>Region: {trigger.eventData.region}</span>
                  <span>Executed: {formatRelativeTime(trigger.timestamp)}</span>
                </div>
              </div>
              
              <div className="text-right text-sm text-muted-foreground">
                <div>{trigger.timestamp.toLocaleTimeString()}</div>
                <div>{trigger.timestamp.toLocaleDateString()}</div>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredTriggers.length === 0 && (
          <Card className="p-12 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              {triggerHistory.length === 0 ? 'No executions yet' : 'No matching executions'}
            </p>
            <p className="text-sm text-muted-foreground">
              {triggerHistory.length === 0 
                ? 'Workflow executions will appear here as they happen'
                : 'Try adjusting your filters to see more results'
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};