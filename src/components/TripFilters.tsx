import { useTranslation } from 'react-i18next';
import { FilterOptions } from '@/types/trip';
import { getUniqueLines, getUniqueRoutes, getUniqueConsortiums } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface TripFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isVisible: boolean;
}

export const TripFilters = ({ filters, onFiltersChange, isVisible }: TripFiltersProps) => {
  const { t } = useTranslation();

  const uniqueLines = getUniqueLines();
  const uniqueRoutes = getUniqueRoutes();
  const uniqueConsortiums = getUniqueConsortiums();

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value,
    });
  };

  if (!isVisible) return null;

  return (
    <Card className="p-4 m-4 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{t('filters')}</h3>
      </div>
      
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
    </Card>
  );
};