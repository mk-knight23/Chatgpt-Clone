"use client"

import { useState, useEffect } from 'react';
import { Settings, Key, Link2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PROVIDERS, getProvider } from '@/lib/providers/registry';
import { useSettings } from '@/lib/settings-store';
import { validateApiKey } from '@/lib/providers/validator';

export function SettingsDialog() {
  const { selectedProvider, selectedModel, providerSettings, setProvider, setModel, setProviderSettings } = useSettings();
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; error?: string } | null>(null);

  const provider = getProvider(selectedProvider);

  useEffect(() => {
    const settings = providerSettings[selectedProvider] || {};
    setApiKey(settings.apiKey || '');
    setBaseUrl(settings.baseUrl || provider?.baseUrl || '');
    setValidationResult(null);
  }, [selectedProvider, providerSettings, provider]);

  const handleValidate = async () => {
    setValidating(true);
    setValidationResult(null);
    const result = await validateApiKey(selectedProvider, apiKey, baseUrl);
    setValidationResult(result);
    setValidating(false);
  };

  const handleSave = async () => {
    if (provider?.requiresApiKey && !validationResult?.valid) {
      await handleValidate();
      return;
    }
    setProviderSettings(selectedProvider, { apiKey, baseUrl });
    setOpen(false);
  };

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    const newProviderData = getProvider(newProvider);
    if (newProviderData?.models[0]) {
      setModel(newProviderData.models[0].id);
    }
    setValidationResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>AI Provider Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select value={selectedProvider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {PROVIDERS.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.models.length} models)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={selectedModel} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {provider?.models.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {provider?.models.find(m => m.id === selectedModel)?.description && (
              <p className="text-xs text-muted-foreground">
                {provider.models.find(m => m.id === selectedModel)?.description}
              </p>
            )}
          </div>

          {provider?.requiresApiKey && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                API Key
              </Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter API key"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setValidationResult(null);
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleValidate}
                  disabled={!apiKey || validating}
                >
                  {validating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Test'
                  )}
                </Button>
              </div>
              {validationResult && (
                <div className={`flex items-center gap-2 text-sm ${validationResult.valid ? 'text-green-600' : 'text-red-600'}`}>
                  {validationResult.valid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>API key is valid</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>{validationResult.error || 'Invalid API key'}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {provider?.requiresBaseUrl && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Base URL
              </Label>
              <Input
                placeholder={provider.baseUrl}
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </div>
          )}

          <Button onClick={handleSave} className="w-full" disabled={validating}>
            {provider?.requiresApiKey && !validationResult?.valid ? 'Validate & Save' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
