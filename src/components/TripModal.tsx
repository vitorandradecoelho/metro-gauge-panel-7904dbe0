import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TripModal = ({ isOpen, onClose }: TripModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedLine, setSelectedLine] = useState('01');
  const [selectedRoute, setSelectedRoute] = useState('01 - Taboão / Sentido Esperança');
  const [selectedTab, setSelectedTab] = useState('15B');
  const [dragOption, setDragOption] = useState('current-time');

  const handleSave = async () => {
    if (!selectedVehicle) {
      toast({
        title: t('saveError'),
        description: t('vehicle') + ' é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/error for demo
          Math.random() > 0.3 ? resolve(true) : reject(new Error('API Error'));
        }, 1000);
      });

      toast({
        title: t('saveSuccess'),
        description: `${t('vehicle')}: ${selectedVehicle}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: t('saveError'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-700 text-white border-slate-600">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-white font-medium">{t('actionCenter')}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-slate-600 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-4">{t('dragVehicle')}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-white text-sm mb-2 block">{t('vehicle')}</Label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder={t('select')} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-600 border-slate-500">
                    <SelectItem value="vehicle1" className="text-white hover:bg-slate-500">3161</SelectItem>
                    <SelectItem value="vehicle2" className="text-white hover:bg-slate-500">3173</SelectItem>
                    <SelectItem value="vehicle3" className="text-white hover:bg-slate-500">3179</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-white text-sm mb-2 block">{t('line')}</Label>
                <div className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white">
                  {selectedLine}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-white text-sm mb-2 block">{t('route')}</Label>
                <div className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm">
                  {selectedRoute}
                </div>
              </div>
              
              <div>
                <Label className="text-white text-sm mb-2 block">{t('tab')}</Label>
                <div className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white">
                  {selectedTab}
                </div>
              </div>
            </div>
            
            <RadioGroup value={dragOption} onValueChange={setDragOption} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current-time" id="current-time" className="border-white text-white" />
                <Label htmlFor="current-time" className="text-white text-sm">
                  {t('dragCurrentTime')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="from-time" id="from-time" className="border-white text-white" />
                <Label htmlFor="from-time" className="text-white text-sm">
                  {t('dragFromTime')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="same-table" id="same-table" className="border-white text-white" />
                <Label htmlFor="same-table" className="text-white text-sm">
                  {t('dragSameTable')}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="border-slate-500 text-white hover:bg-slate-600"
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {t('save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};