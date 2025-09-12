export interface N8nWebhook {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  workflowId?: string;
  description?: string;
  tags: string[];
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  webhookId: string;
  conditions: AutomationCondition[];
  isActive: boolean;
  description?: string;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface AutomationCondition {
  type: 'severity' | 'region' | 'keyword' | 'source' | 'count';
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
  value: string | number | string[];
}

export interface WorkflowTrigger {
  webhookId: string;
  eventData: any;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export interface N8nMetrics {
  totalWebhooks: number;
  activeWebhooks: number;
  totalTriggers: number;
  todayTriggers: number;
  successRate: number;
  avgResponseTime: number;
}