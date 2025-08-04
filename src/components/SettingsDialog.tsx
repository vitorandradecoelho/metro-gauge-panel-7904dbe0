import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  onSettingsSaved?: () => void;
}

export const SettingsDialog = ({ onSettingsSaved }: SettingsDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('apiUrl') || '/api/trips');
  const [zone, setZone] = useState(localStorage.getItem('zone') || '4');

  const handleSave = () => {
    localStorage.setItem('apiUrl', apiUrl);
    localStorage.setItem('zone', zone);
    
    toast({
      title: t('settingsSaved'),
      description: t('settingsUpdated'),
    });
    
    setOpen(false);
    
    if (onSettingsSaved) {
      onSettingsSaved();
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden md:inline">{t('settings')}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('apiSettings')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">{t('apiUrl')}</Label>
              <Input
                id="apiUrl"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="/api/trips"
              />
              <p className="text-xs text-muted-foreground">
                {t('apiUrlDescription')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zone">{t('zone')}</Label>
              <Input
                id="zone"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="4"
              />
              <p className="text-xs text-muted-foreground">
                {t('zoneDescription')}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};