import { useTranslation } from 'react-i18next';
import { FilterOptions } from '@/types/trip';
import { getUniqueRoutes, getUniqueConsortiums } from '@/data/mockData';
import { linesService } from '@/services/api';
import { useState, useEffect } from 'react';
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

interface LineData {
  _id: string;
  numero: string;
  descr: string;
  trajetos: TrajetoData[];
  id: string;
}

interface TrajetoData {
  _id: string;
  nome: string;
  sentido: string;
  nomeExibicao: string;
}

export const TripFilters = ({ filters, onFiltersChange, onConsult, isVisible }: TripFiltersProps) => {
  const { t } = useTranslation();
  
  const [lines, setLines] = useState<LineData[]>([]);
  const [loadingLines, setLoadingLines] = useState(false);
  const [availableTrajetos, setAvailableTrajetos] = useState<TrajetoData[]>([]);

  const uniqueRoutes = getUniqueRoutes();
  const uniqueConsortiums = getUniqueConsortiums();

  useEffect(() => {
    const fetchLines = async () => {
      try {
        setLoadingLines(true);
        const linesData = await linesService.getLines();
        setLines(linesData);
      } catch (error) {
        console.error('Error fetching lines:', error);
        setLines([]);
      } finally {
        setLoadingLines(false);
      }
    };

    fetchLines();
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: string | boolean | number) => {
    onFiltersChange({
      ...filters,
      [key]: typeof value === 'string' && value === 'all' ? '' : value,
    });
  };

  // Update available trajetos when line selection changes
  useEffect(() => {
    if (filters.line) {
      const selectedLine = lines.find(line => 
        `${line.numero} - ${line.descr}` === filters.line
      );
      
      if (selectedLine) {
        setAvailableTrajetos(selectedLine.trajetos || []);
      } else {
        setAvailableTrajetos([]);
      }
    } else {
      setAvailableTrajetos([]);
      // Clear trajeto selection when line is cleared
      if (filters.trajeto) {
        handleFilterChange('trajeto', '');
      }
    }
  }, [filters.line, lines]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <SelectContent className="max-h-60 bg-popover border shadow-lg z-50">
                <SelectItem value="all">{t('allLines')}</SelectItem>
                {loadingLines ? (
                  <SelectItem value="" disabled>Carregando linhas...</SelectItem>
                ) : (
                  lines.map((line) => (
                    <SelectItem key={line.id} value={`${line.numero} - ${line.descr}`}>
                      {line.numero} - {line.descr.substring(0, 30)}{line.descr.length > 30 ? '...' : ''}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Trajeto Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Trajeto
            </label>
            <Select
              value={filters.trajeto || 'all'}
              onValueChange={(value) => handleFilterChange('trajeto', value)}
              disabled={!filters.line || filters.line === 'all' || availableTrajetos.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um trajeto" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-popover border shadow-lg z-50">
                <SelectItem value="all">Todos os Trajetos</SelectItem>
                {availableTrajetos.map((trajeto) => (
                  <SelectItem key={trajeto._id} value={trajeto.nome}>
                    {trajeto.nomeExibicao} ({trajeto.sentido})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
              <SelectContent className="bg-popover border shadow-lg z-50">
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
              <SelectContent className="bg-popover border shadow-lg z-50">
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
        {!filters.realTimeEnabled && (
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
        )}

        {/* Real Time Option */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              checked={filters.realTimeEnabled}
              onCheckedChange={(checked) => handleFilterChange('realTimeEnabled', checked)}
            />
            <label className="text-sm font-medium text-foreground">
              Filtro Tempo Real
            </label>
          </div>
          
          {filters.realTimeEnabled && (
            <div className="ml-6 space-y-2 bg-muted/50 p-3 rounded-md">
              <label className="text-xs text-muted-foreground">
                Buscar viagens dos últimos X minutos (partida real e planejada)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="1440"
                  value={filters.realTimeMinutes}
                  onChange={(e) => handleFilterChange('realTimeMinutes', parseInt(e.target.value) || 30)}
                  className="w-20"
                  placeholder="30"
                />
                <span className="text-xs text-muted-foreground">minutos atrás</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Aplica filtro nos horários de partida real e partida planejada das viagens
              </p>
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