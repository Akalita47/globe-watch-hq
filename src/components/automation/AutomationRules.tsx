import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AutomationRule, AutomationCondition, N8nWebhook } from '@/types/automation';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Zap, 
  Play, 
  Pause,
  Filter,
  Target
} from 'lucide-react';

interface AutomationRulesProps {
  webhooks: N8nWebhook[];
  events: any[];
}

export const AutomationRules = ({ webhooks, events }: AutomationRulesProps) => {
  const [rules, setRules] = useState<AutomationRule[]>([
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
    },
    {
      id: '2',
      name: 'Regional High-Threat Analysis',
      webhookId: '2',
      conditions: [
        { type: 'severity', operator: 'in', value: ['critical', 'high'] },
        { type: 'region', operator: 'equals', value: 'europe' }
      ],
      isActive: true,
      description: 'Automated analysis for high-threat events in Europe',
      createdAt: new Date('2024-01-12'),
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
      triggerCount: 23
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    webhookId: '',
    description: '',
    conditions: [] as AutomationCondition[]
  });
  const [editingCondition, setEditingCondition] = useState<AutomationCondition | null>(null);
  
  const { toast } = useToast();

  const handleCreateRule = () => {
    const rule: AutomationRule = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRule.name,
      webhookId: newRule.webhookId,
      conditions: newRule.conditions,
      description: newRule.description,
      isActive: true,
      createdAt: new Date(),
      triggerCount: 0
    };

    setRules([...rules, rule]);
    setShowCreateDialog(false);
    setNewRule({ name: '', webhookId: '', description: '', conditions: [] });
    
    toast({
      title: "Automation Rule Created",
      description: `${rule.name} is now monitoring for matching events`,
    });
  };

  const handleToggleRule = (id: string) => {
    const updated = rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    );
    setRules(updated);
    
    const rule = rules.find(r => r.id === id);
    toast({
      title: rule?.isActive ? "Rule Disabled" : "Rule Enabled",
      description: `${rule?.name} automation is now ${rule?.isActive ? 'inactive' : 'active'}`,
    });
  };

  const handleDeleteRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    setRules(rules.filter(r => r.id !== id));
    
    toast({
      title: "Rule Deleted",
      description: `${rule?.name} has been removed`,
    });
  };

  const addCondition = () => {
    const condition: AutomationCondition = {
      type: 'severity',
      operator: 'equals',
      value: 'high'
    };
    setNewRule({
      ...newRule,
      conditions: [...newRule.conditions, condition]
    });
  };

  const updateCondition = (index: number, condition: AutomationCondition) => {
    const updated = [...newRule.conditions];
    updated[index] = condition;
    setNewRule({ ...newRule, conditions: updated });
  };

  const removeCondition = (index: number) => {
    setNewRule({
      ...newRule,
      conditions: newRule.conditions.filter((_, i) => i !== index)
    });
  };

  const getWebhookName = (webhookId: string) => {
    return webhooks.find(w => w.id === webhookId)?.name || 'Unknown Webhook';
  };

  const formatConditionValue = (condition: AutomationCondition) => {
    if (Array.isArray(condition.value)) {
      return condition.value.join(', ');
    }
    return condition.value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Automation Rules</h2>
          <p className="text-sm text-muted-foreground">Define intelligent triggers for n8n workflows</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={webhooks.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {rules.map(rule => (
          <Card key={rule.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{rule.name}</h3>
                  <Badge variant={rule.isActive ? "default" : "secondary"}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                {rule.description && (
                  <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="font-medium">Webhook:</span>
                    <Badge variant="outline">{getWebhookName(rule.webhookId)}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4 text-primary" />
                    <span className="font-medium">Conditions:</span>
                    <div className="flex flex-wrap gap-2">
                      {rule.conditions.map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {condition.type} {condition.operator} {formatConditionValue(condition)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                  <span>Triggers: {rule.triggerCount}</span>
                  <span>Created: {rule.createdAt.toLocaleDateString()}</span>
                  {rule.lastTriggered && (
                    <span>Last triggered: {rule.lastTriggered.toLocaleString()}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleRule(rule.id)}
                >
                  {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteRule(rule.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {rules.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No automation rules configured</p>
              <p className="text-sm mb-4">Create intelligent rules to automatically trigger workflows</p>
              <Button 
                onClick={() => setShowCreateDialog(true)} 
                disabled={webhooks.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Rule
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Create Rule Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Automation Rule</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  placeholder="e.g., Critical Event Alert"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="webhook">Target Webhook</Label>
                <Select value={newRule.webhookId} onValueChange={(value) => setNewRule({ ...newRule, webhookId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select webhook" />
                  </SelectTrigger>
                  <SelectContent>
                    {webhooks.map(webhook => (
                      <SelectItem key={webhook.id} value={webhook.id}>
                        {webhook.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Describe when this rule should trigger..."
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              />
            </div>
            
            {/* Conditions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Trigger Conditions</Label>
                <Button variant="outline" size="sm" onClick={addCondition}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
              </div>
              
              <div className="space-y-3">
                {newRule.conditions.map((condition, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-4 gap-4 items-end">
                      <div>
                        <Label>Field</Label>
                        <Select 
                          value={condition.type} 
                          onValueChange={(value: any) => updateCondition(index, { ...condition, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="severity">Severity</SelectItem>
                            <SelectItem value="region">Region</SelectItem>
                            <SelectItem value="keyword">Keyword</SelectItem>
                            <SelectItem value="source">Source</SelectItem>
                            <SelectItem value="count">Event Count</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Operator</Label>
                        <Select 
                          value={condition.operator} 
                          onValueChange={(value: any) => updateCondition(index, { ...condition, operator: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="greater_than">Greater Than</SelectItem>
                            <SelectItem value="less_than">Less Than</SelectItem>
                            <SelectItem value="in">In List</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Value</Label>
                        <Input
                          value={condition.value.toString()}
                          onChange={(e) => updateCondition(index, { ...condition, value: e.target.value })}
                          placeholder="Enter value..."
                        />
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCondition(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {newRule.conditions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No conditions defined. Add at least one condition to create the rule.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRule}
              disabled={!newRule.name || !newRule.webhookId || newRule.conditions.length === 0}
            >
              Create Rule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};