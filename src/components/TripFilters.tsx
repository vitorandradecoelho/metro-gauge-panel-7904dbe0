import { useTranslation } from 'react-i18next';
import { FilterOptions } from '@/types/trip';
import { getUniqueLines, getUniqueRoutes, getUniqueConsortiums } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Filter, Calendar, Clock, Search } from 'lucide-react';

interface TripFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onConsult?: () => void;
  isVisible: boolean;
}

export const TripFilters = ({ filters, onFiltersChange, onConsult, isVisible }: TripFiltersProps) => {
  const { t } = useTranslation();

  const uniqueLines = getUniqueLines();
  const uniqueRoutes = getUniqueRoutes();
  const uniqueConsortiums = getUniqueConsortiums();

  const handleFilterChange = (key: keyof FilterOptions, value: string | boolean | number) => {
    onFiltersChange({
      ...filters,
      [key]: typeof value === 'string' && value === 'all' ? '' : value,
    });
  };

  const handleConsult = () => {
    onConsult?.();
  };

  if (!isVisible) return null;

  return (
    <Card className="p-4 m-4 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{t('filters')}</h3>
      </div>
      
      <div className="space-y-6">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Line Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('filterLine')}
            </label>
            <Select
              value={filters.line || 'all'}
              onValueChange={(value) => handleFilterChange('line', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectLine')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">{t('allLines')}</SelectItem>
                {uniqueLines.map((line) => (
                  <SelectItem key={line} value={line}>
                    {line.substring(0, 15)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Route Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('filterRoute')}
            </label>
            <Select
              value={filters.route || 'all'}
              onValueChange={(value) => handleFilterChange('route', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectRoute')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allRoutes')}</SelectItem>
                {uniqueRoutes.map((route) => (
                  <SelectItem key={route} value={route}>
                    {t(route)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Consortium Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('filterConsortium')}
            </label>
            <Select
              value={filters.consortium || 'all'}
              onValueChange={(value) => handleFilterChange('consortium', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectConsortium')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allConsortiums')}</SelectItem>
                {uniqueConsortiums.map((consortium) => (
                  <SelectItem key={consortium} value={consortium}>
                    {consortium}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date and Time Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data/Hora Inicial
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Data</label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Hora</label>
                <Input
                  type="time"
                  value={filters.startTime}
                  onChange={(e) => handleFilterChange('startTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Data/Hora Final
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Data</label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Hora</label>
                <Input
                  type="time"
                  value={filters.endTime}
                  onChange={(e) => handleFilterChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Real Time Option */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              checked={filters.realTimeEnabled}
              onCheckedChange={(checked) => handleFilterChange('realTimeEnabled', checked)}
            />
            <label className="text-sm font-medium text-foreground">
              Tempo Real
            </label>
          </div>
          
          {filters.realTimeEnabled && (
            <div className="ml-6 space-y-2">
              <label className="text-xs text-muted-foreground">
                Minutos anteriores à hora atual
              </label>
              <Input
                type="number"
                min="1"
                max="1440"
                value={filters.realTimeMinutes}
                onChange={(e) => handleFilterChange('realTimeMinutes', parseInt(e.target.value) || 0)}
                className="w-32"
                placeholder="Ex: 30"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button onClick={handleConsult} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Consultar
          </Button>
        </div>
      </div>
    </Card>
  );
};