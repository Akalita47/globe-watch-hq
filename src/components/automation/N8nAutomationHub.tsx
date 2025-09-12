import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WebhookManager } from './WebhookManager';
import { AutomationRules } from './AutomationRules';
import { WorkflowMonitor } from './WorkflowMonitor';
import { IntelligentAutomation } from './IntelligentAutomation';
import { N8nMetrics as N8nMetricsType, N8nWebhook, AutomationRule } from '@/types/automation';
import { 
  Workflow, 
  Zap, 
  Activity, 
  Settings, 
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface N8nAutomationHubProps {
  onClose: () => void;
  events: any[];
}

export const N8nAutomationHub = ({ onClose, events }: N8nAutomationHubProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [webhooks, setWebhooks] = useState<N8nWebhook[]>([
    {
      id: '1',
      name: 'Critical Event Alert',
      url: 'https://your-n8n.domain.com/webhook/critical-alerts',
      isActive: true,
      workflowId: 'wf_001',
      description: 'Triggers when critical events are detected',
      tags: ['alerts', 'critical'],
      createdAt: new Date('2024-01-15'),
      lastTriggered: new Date(),
      triggerCount: 127
    },
    {
      id: '2', 
      name: 'Daily Intelligence Report',
      url: 'https://your-n8n.domain.com/webhook/daily-report',
      isActive: true,
      workflowId: 'wf_002',
      description: 'Generates automated daily intelligence reports',
      tags: ['reports', 'daily'],
      createdAt: new Date('2024-01-10'),
      lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000),
      triggerCount: 45
    }
  ]);

  const [automationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Critical Event Immediate Alert',
      webhookId: '1',
      conditions: [
        { type: 'severity', operator: 'equals', value: 'critical' }
      ],
      isActive: true,
      description: 'Trigger instant notification for all critical events',
      createdAt: new Date('2024-01-15'),
      lastTriggered: new Date(),
      triggerCount: 47
    }
  ]);

  const metrics: N8nMetricsType = {
    totalWebhooks: webhooks.length,
    activeWebhooks: webhooks.filter(w => w.isActive).length,
    totalTriggers: webhooks.reduce((sum, w) => sum + w.triggerCount, 0),
    todayTriggers: 23,
    successRate: 98.2,
    avgResponseTime: 245
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Workflow className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">n8n Automation Hub</h1>
              <p className="text-sm text-muted-foreground">Advanced workflow automation and intelligence processing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/10">
              <Activity className="w-3 h-3 mr-1" />
              {metrics.activeWebhooks} Active
            </Badge>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="p-6 border-b border-border bg-secondary/30">
          <div className="grid grid-cols-6 gap-4">
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{metrics.totalWebhooks}</div>
                  <div className="text-xs text-muted-foreground">Total Webhooks</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{metrics.activeWebhooks}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{metrics.totalTriggers}</div>
                  <div className="text-xs text-muted-foreground">Total Triggers</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{metrics.todayTriggers}</div>
                  <div className="text-xs text-muted-foreground">Today</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{metrics.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{metrics.avgResponseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 mx-6 mt-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="rules">Automation Rules</TabsTrigger>
              <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
              <TabsTrigger value="monitor">Monitor</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto p-6">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <Zap className="w-4 h-4 mr-2" />
                        Create New Webhook
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Setup Automation Rule
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Activity className="w-4 h-4 mr-2" />
                        Test All Workflows
                      </Button>
                    </div>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Triggers</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Critical Event Alert</div>
                          <div className="text-xs text-muted-foreground">2 minutes ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Daily Report Generated</div>
                          <div className="text-xs text-muted-foreground">1 hour ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Webhook Retry</div>
                          <div className="text-xs text-muted-foreground">3 hours ago</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="webhooks" className="mt-0">
                <WebhookManager 
                  webhooks={webhooks}
                  onWebhooksChange={setWebhooks}
                />
              </TabsContent>

              <TabsContent value="rules" className="mt-0">
                <AutomationRules 
                  webhooks={webhooks}
                  events={events}
                />
              </TabsContent>

              <TabsContent value="intelligence" className="mt-0">
                <IntelligentAutomation
                  webhooks={webhooks}
                  events={events}
                  rules={automationRules}
                />
              </TabsContent>

              <TabsContent value="monitor" className="mt-0">
                <WorkflowMonitor 
                  webhooks={webhooks}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};