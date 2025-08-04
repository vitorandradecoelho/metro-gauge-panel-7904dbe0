import { useTranslation } from "react-i18next";
import { FilterOptions } from "@/types/trip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Filter, Calendar, Clock, Search } from "lucide-react";
import { ILinha } from "@/types/line";
import { useTrips } from "@/hooks/useTrips";
import { useToast } from "@/hooks/use-toast";

interface TripFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onConsult?: () => void;
  isVisible: boolean;
}

export const TripFilters = ({
  filters,
  onFiltersChange,
  onConsult,
  isVisible,
}: TripFiltersProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { lines, consortiums, routes, setRoutes, isLoading } = useTrips();

  const getUniqueRoutes = (line: ILinha): any[] => {
    return Array.from(line.trajetos);
  };

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: string | boolean | number
  ) => {
    const newFilters = {
      ...filters,
      [key]: typeof value === "string" && value === "all" ? "" : value,
    };

    // Atualiza os filtros
    onFiltersChange(newFilters);

    // Se mudou a linha, atualiza as rotas disponíveis
    if (key === "line") {
      const line = lines.find((ln) => ln._id === value);
      if (line) {
        setRoutes(getUniqueRoutes(line));
      } else {
        setRoutes([]); // Limpa as rotas se "todas" for selecionada
      }

      // Limpa a rota selecionada quando muda a linha
      onFiltersChange({
        ...newFilters,
        route: "",
      });
    }
  };

  const handleConsult = () => {
    onConsult?.();
  };

  if (!isVisible) return null;

  return (
    <Card className="p-4 m-4 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">
          {t("filters")}
        </h3>
      </div>

      <div className="space-y-6">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Line Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("filterLine")}
            </label>
            <Select
              value={filters.line || "all"}
              onValueChange={(value) => handleFilterChange("line", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectLine")} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">{t("selectLine")}</SelectItem>
                {lines.map((line) => (
                  <SelectItem key={line._id} value={line._id}>
                    {line.descr.length > 45
                      ? `${line.descr.substring(0, 45)}...`
                      : line.descr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Route Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("filterRoute")}
            </label>
            <Select
              value={filters.route || "all"}
              onValueChange={(value) => handleFilterChange("route", value)}
              disabled={!filters.line} // Desabilita se nenhuma linha foi selecionada
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !filters.line
                      ? "Selecione uma linha primeiro"
                      : t("selectRoute")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allRoutes")}</SelectItem>
                {routes.map((route) => (
                  <SelectItem key={route._id} value={route.sentido}>
                    {route.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Consortium Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("filterConsortium")}
            </label>
            <Select
              value={filters.consortium || "all"}
              onValueChange={(value) => handleFilterChange("consortium", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectConsortium")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("selectConsortium")}</SelectItem>
                {consortiums.map((consortium) => (
                  <SelectItem
                    key={consortium.consorcioId}
                    value={consortium.consorcio}
                  >
                    {consortium.consorcio}
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
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Hora</label>
                  <Input
                    type="time"
                    value={filters.startTime}
                    onChange={(e) =>
                      handleFilterChange("startTime", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Hora</label>
                  <Input
                    type="time"
                    value={filters.endTime}
                    onChange={(e) =>
                      handleFilterChange("endTime", e.target.value)
                    }
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
              onCheckedChange={(checked) =>
                handleFilterChange("realTimeEnabled", checked)
              }
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
                  onChange={(e) =>
                    handleFilterChange(
                      "realTimeMinutes",
                      parseInt(e.target.value) || 30
                    )
                  }
                  className="w-20"
                  placeholder="30"
                />
                <span className="text-xs text-muted-foreground">
                  minutos atrás
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Aplica filtro nos horários de partida real e partida planejada
                das viagens. Auto-refresh ativo a cada 60 segundos.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            onClick={handleConsult}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
            {isLoading ? "Consultando..." : "Consultar"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
