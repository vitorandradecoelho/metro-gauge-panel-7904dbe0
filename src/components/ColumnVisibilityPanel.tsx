import { useTranslation } from 'react-i18next';
import { ColumnVisibility } from '@/types/trip';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface ColumnVisibilityPanelProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
  isVisible: boolean;
}

export const ColumnVisibilityPanel = ({ 
  visibility, 
  onVisibilityChange, 
  isVisible 
}: ColumnVisibilityPanelProps) => {
  const { t } = useTranslation();

  const handleToggle = (column: keyof ColumnVisibility) => {
    onVisibilityChange({
      ...visibility,
      [column]: !visibility[column],
    });
  };

  if (!isVisible) return null;

  const columns: Array<{ key: keyof ColumnVisibility; label: string }> = [
    { key: 'date', label: t('date') },
    { key: 'status', label: t('status') },
    { key: 'line', label: t('line') },
    { key: 'route', label: t('route') },
    { key: 'execution', label: t('execution') },
    { key: 'plannedVehicle', label: t('plannedVehicle') },
    { key: 'realVehicle', label: t('realVehicle') },
    { key: 'tab', label: t('tab') },
    { key: 'passengers', label: t('passengers') },
    { key: 'plannedStart', label: t('plannedStart') },
    { key: 'realStart', label: t('realStart') },
    { key: 'startDiff', label: t('startDiff') },
    { key: 'plannedEnd', label: t('plannedEnd') },
    { key: 'realEnd', label: t('realEnd') },
    { key: 'endDiff', label: t('endDiff') },
    { key: 'headway', label: t('headway') },
    { key: 'driver', label: t('driver') },
    { key: 'travelTime', label: t('travelTime') },
    { key: 'completion', label: t('completion') },
  ];

  return (
    <Card className="p-4 m-4 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <EyeOff className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{t('hideColumns')}</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {columns.map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-2">
            <Switch
              id={key}
              checked={visibility[key]}
              onCheckedChange={() => handleToggle(key)}
            />
            <Label
              htmlFor={key}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </Label>
          </div>
        ))}
      </div>
    </Card>
  );
};