import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Palette, Eye, Save, Download, Upload, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrandingCustomizerProps {
  isVisible: boolean;
  onClose: () => void;
}

export const BrandingCustomizer: React.FC<BrandingCustomizerProps> = ({ isVisible, onClose }) => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    organizationName: 'Global Intelligence Desk',
    logoUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#10B981',
    theme: 'dark',
    whiteLabel: false,
    customFooter: '',
    analyticsCode: '',
    apiEndpoint: ''
  });

  if (!isVisible) return null;

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    toast({
      title: "Branding Updated",
      description: "Your enterprise branding settings have been saved successfully.",
    });
    onClose();
  };

  const previewTheme = () => {
    toast({
      title: "Theme Preview",
      description: "Theme changes would be applied to see preview in enterprise version.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Enterprise Branding</h2>
                <p className="text-sm text-muted-foreground">Customize your intelligence platform for your organization</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <Tabs defaultValue="branding" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="branding" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Organization Identity</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Organization Name</label>
                    <Input
                      value={settings.organizationName}
                      onChange={(e) => setSettings({...settings, organizationName: e.target.value})}
                      placeholder="Your Organization Name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Logo URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={settings.logoUrl}
                        onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                        placeholder="https://your-domain.com/logo.png"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground">White Label Mode</label>
                      <p className="text-xs text-muted-foreground">Remove all Lovable branding</p>
                    </div>
                    <Switch
                      checked={settings.whiteLabel}
                      onCheckedChange={(checked) => setSettings({...settings, whiteLabel: checked})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Custom Footer Text</label>
                    <Input
                      value={settings.customFooter}
                      onChange={(e) => setSettings({...settings, customFooter: e.target.value})}
                      placeholder="© 2025 Your Organization - Confidential"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-12 h-8 rounded border"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="w-12 h-8 rounded border"
                      />
                      <Input
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                        className="w-12 h-8 rounded border"
                      />
                      <Input
                        value={settings.accentColor}
                        onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">Theme</label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark Intelligence</SelectItem>
                      <SelectItem value="light">Light Professional</SelectItem>
                      <SelectItem value="blue">Corporate Blue</SelectItem>
                      <SelectItem value="military">Military Green</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={previewTheme} className="mt-4" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Theme
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Enterprise Features</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">AI-Powered Analytics</div>
                      <div className="text-sm text-muted-foreground">Advanced sentiment analysis and predictive modeling</div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">Threat Assessment Engine</div>
                      <div className="text-sm text-muted-foreground">Real-time threat scoring and risk analysis</div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">Export & Reporting</div>
                      <div className="text-sm text-muted-foreground">Professional PDF reports and data exports</div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">n8n Automation Hub</div>
                      <div className="text-sm text-muted-foreground">Workflow automation and webhook integrations</div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border opacity-50">
                    <div>
                      <div className="font-medium">Multi-User Access</div>
                      <div className="text-sm text-muted-foreground">Role-based access control and team collaboration</div>
                    </div>
                    <Badge variant="secondary">Requires Supabase</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border opacity-50">
                    <div>
                      <div className="font-medium">Historical Analytics</div>
                      <div className="text-sm text-muted-foreground">Long-term trend analysis and data persistence</div>
                    </div>
                    <Badge variant="secondary">Requires Supabase</Badge>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Enterprise Integrations</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Custom API Endpoint</label>
                    <Input
                      value={settings.apiEndpoint}
                      onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
                      placeholder="https://api.your-organization.com/intel"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Connect to your internal intelligence feeds</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Analytics Tracking Code</label>
                    <Input
                      value={settings.analyticsCode}
                      onChange={(e) => setSettings({...settings, analyticsCode: e.target.value})}
                      placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Google Analytics or other tracking services</p>
                  </div>

                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Enterprise SSO Integration</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Connect with Active Directory, LDAP, SAML, or OAuth providers for seamless authentication.
                      Available with Supabase integration.
                    </p>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-6 border-t">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};