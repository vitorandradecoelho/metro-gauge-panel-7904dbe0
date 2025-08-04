import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/useTheme';

import { 
  RefreshCw, 
  Filter, 
  FilterX, 
  Sun, 
  Moon, 
  Languages,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Bus,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  onToggleColumnVisibility: () => void;
}

export const Header = ({ 
  onRefresh, 
  isLoading, 
  showFilters, 
  onToggleFilters,
  onToggleColumnVisibility 
}: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Bus className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Refresh Button */}
            <Button
              variant="outline"
              size={isMobile ? "icon" : "sm"}
              onClick={onRefresh}
              disabled={isLoading}
              className={cn(isLoading)}
            >
              <RefreshCw className="h-4 w-4" />
              {!isMobile && <span className="ml-2">{t('refresh')}</span>}
            </Button>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              size={isMobile ? "icon" : "sm"}
              onClick={onToggleFilters}
            >
              {showFilters ? <FilterX className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              {!isMobile && (
                <span className="ml-2">
                  {showFilters ? t('hideFilters') : t('showFilters')}
                </span>
              )}
            </Button>

            {/* Column Visibility Toggle */}
            <Button
              variant="outline"
              size={isMobile ? "icon" : "sm"}
              onClick={onToggleColumnVisibility}
            >
              <EyeOff className="h-4 w-4" />
              {!isMobile && <span className="ml-2">{t('hideColumns')}</span>}
            </Button>

            {/* Trip Edit Button */}
            <Button
              variant="outline"
              size={isMobile ? "icon" : "sm"}
              onClick={() => window.open('/trip-edit', '_blank')}
            >
              <Plus className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Editar Viagens</span>}
            </Button>

            {/* Language Selector */}
            <Select
              value={i18n.language}
              onValueChange={changeLanguage}
            >
              <SelectTrigger className={cn("w-auto border-0 bg-transparent min-w-0", isMobile && "w-8 h-8")}>
                <Languages className="h-4 w-4 flex-shrink-0" />
                {!isMobile && <SelectValue />}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">{t('português')}</SelectItem>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="es-CL">{t('español')}</SelectItem>
              </SelectContent>
            </Select>


            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};