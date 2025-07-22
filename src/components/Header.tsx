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
  Bus
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
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Bus className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {isMobile ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                <span>{isMobile ? 'Mobile' : 'Desktop'}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <Button
              variant="outline"
              size={isMobile ? "icon-sm" : "sm"}
              onClick={onRefresh}
              disabled={isLoading}
              className={cn(isLoading && "animate-spin")}
            >
              <RefreshCw className="h-4 w-4" />
              {!isMobile && <span className="ml-2">{t('refresh')}</span>}
            </Button>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              size={isMobile ? "icon-sm" : "sm"}
              onClick={onToggleFilters}
            >
              {showFilters ? <FilterX className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              {!isMobile && (
                <span className="ml-2">
                  {showFilters ? t('hideFilters') : t('showFilters')}
                </span>
              )}
            </Button>

            {/* Column Visibility Toggle - Only show on desktop */}
            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleColumnVisibility}
              >
                <EyeOff className="h-4 w-4" />
                <span className="ml-2">{t('hideColumns')}</span>
              </Button>
            )}

            {/* Language Selector */}
            <Select
              value={i18n.language}
              onValueChange={changeLanguage}
            >
              <SelectTrigger className={cn("w-auto border-0 bg-transparent", isMobile && "w-10")}>
                <Languages className="h-4 w-4" />
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
              size={isMobile ? "icon-sm" : "icon"}
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