import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { N8nWebhook } from '@/types/automation';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Play, 
  Pause,
  Copy,
  TestTube
} from 'lucide-react';

interface WebhookManagerProps {
  webhooks: N8nWebhook[];
  onWebhooksChange: (webhooks: N8nWebhook[]) => void;
}

export const WebhookManager = ({ webhooks, onWebhooksChange }: WebhookManagerProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<N8nWebhook | null>(null);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    description: '',
    tags: ''
  });
  const { toast } = useToast();

  const handleCreateWebhook = () => {
    const webhook: N8nWebhook = {
      id: Math.random().toString(36).substr(2, 9),
      name: newWebhook.name,
      url: newWebhook.url,
      description: newWebhook.description,
      tags: newWebhook.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isActive: true,
      createdAt: new Date(),
      triggerCount: 0
    };

    onWebhooksChange([...webhooks, webhook]);
    setShowCreateDialog(false);
    setNewWebhook({ name: '', url: '', description: '', tags: '' });
    
    toast({
      title: "Webhook Created",
      description: `${webhook.name} has been successfully configured`,
    });
  };

  const handleToggleWebhook = (id: string) => {
    const updated = webhooks.map(webhook => 
      webhook.id === id ? { ...webhook, isActive: !webhook.isActive } : webhook
    );
    onWebhooksChange(updated);
    
    const webhook = webhooks.find(w => w.id === id);
    toast({
      title: webhook?.isActive ? "Webhook Disabled" : "Webhook Enabled",
      description: `${webhook?.name} is now ${webhook?.isActive ? 'inactive' : 'active'}`,
    });
  };

  const handleDeleteWebhook = (id: string) => {
    const webhook = webhooks.find(w => w.id === id);
    onWebhooksChange(webhooks.filter(w => w.id !== id));
    
    toast({
      title: "Webhook Deleted",
      description: `${webhook?.name} has been removed`,
    });
  };

  const handleTestWebhook = async (webhook: N8nWebhook) => {
    try {
      toast({
        title: "Testing Webhook",
        description: `Sending test payload to ${webhook.name}...`,
      });

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          event: {
            id: 'test_event',
            title: 'Test Event from OSINT Dashboard',
            severity: 'medium',
            location: { country: 'Test Country', city: 'Test City' },
            description: 'This is a test webhook trigger from the dashboard'
          }
        }),
      });

      toast({
        title: "Test Sent",
        description: "Test payload sent to n8n workflow. Check your n8n execution history.",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send test webhook. Please check the URL and try again.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Webhook URL copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Webhook Management</h2>
          <p className="text-sm text-muted-foreground">Configure and manage n8n webhook endpoints</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {/* Webhooks List */}
      <div className="grid gap-4">
        {webhooks.map(webhook => (
          <Card key={webhook.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{webhook.name}</h3>
                  <Badge variant={webhook.isActive ? "default" : "secondary"}>
                    {webhook.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {webhook.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {webhook.description && (
                  <p className="text-sm text-muted-foreground mb-3">{webhook.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>URL:</span>
                    <code className="px-2 py-1 bg-secondary rounded text-xs">{webhook.url}</code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(webhook.url)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span>Triggers: {webhook.triggerCount}</span>
                  <span>Created: {webhook.createdAt.toLocaleDateString()}</span>
                  {webhook.lastTriggered && (
                    <span>Last triggered: {webhook.lastTriggered.toLocaleString()}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestWebhook(webhook)}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleWebhook(webhook.id)}
                >
                  {webhook.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingWebhook(webhook)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteWebhook(webhook.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {webhooks.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <ExternalLink className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No webhooks configured</p>
              <p className="text-sm mb-4">Create your first webhook to start automating workflows</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Webhook
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Create Webhook Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New n8n Webhook</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Webhook Name</Label>
              <Input
                id="name"
                placeholder="e.g., Critical Event Alert"
                value={newWebhook.name}
                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="url">n8n Webhook URL</Label>
              <Input
                id="url"
                placeholder="https://your-n8n.domain.com/webhook/your-webhook-id"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this webhook does..."
                value={newWebhook.description}
                onChange={(e) => setNewWebhook({ ...newWebhook, description: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="alerts, critical, reports"
                value={newWebhook.tags}
                onChange={(e) => setNewWebhook({ ...newWebhook, tags: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateWebhook}
              disabled={!newWebhook.name || !newWebhook.url}
            >
              Create Webhook
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};