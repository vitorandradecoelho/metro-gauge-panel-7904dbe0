import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  TripStatus,
  ColumnVisibility,
  defaultColumnVisibility,
  ColumnKey,
  defaultColumnOrder,
} from "@/types/trip";
import { useTrips } from "@/hooks/useTrips";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Header } from "@/components/Header";
import { StatusTabs } from "@/components/StatusTabs";
import { TripFilters } from "@/components/TripFilters";
import { TripTable } from "@/components/TripTable";
import { ColumnVisibilityPanel } from "@/components/ColumnVisibilityPanel";
import { Card } from "@/components/ui/card";
import { Loader2, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthStatus } from "@/components/AuthStatus";

const Index = () => {
  const { t } = useTranslation();

  const [showFilters, setShowFilters] = useLocalStorage("showFilters", true);
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<ColumnVisibility>(
      "columnVisibility",
      defaultColumnVisibility
    );
  const [columnOrder, setColumnOrder] = useLocalStorage<ColumnKey[]>(
    "columnOrder",
    defaultColumnOrder
  );

  const {
    trips,
    filteredTrips,
    isLoading,
    error,
    refreshTrips,
    // consultTrips,
    filters,
    setFilters,
    activeStatus,
    setActiveStatus,
  } = useTrips();

  const statusCounts = useMemo(() => {
    const counts = {
      all: trips.length,
      "VIAGEM PLANEJADA E REALIZADA": 0,
      "EM ANDAMENTO": 0,
      "NÃO INICIADA": 0,
    } as Record<TripStatus | "all", number>;

    trips.forEach((trip) => {
      counts[trip.status]++;
    });

    return counts;
  }, [trips]);

  if (isLoading && trips.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">{t("loading")}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-6 max-w-md mx-4">
          <div className="text-center space-y-4">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <h2 className="text-lg font-semibold">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={refreshTrips}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onRefresh={refreshTrips}
        isLoading={isLoading}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleColumnVisibility={() => setShowColumnPanel(!showColumnPanel)}
      />

      <div className="container mx-auto px-4 pt-6">
        <AuthStatus />
      </div>

      <div className="flex items-center justify-center py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div
            className={cn(
              "flex items-center gap-1",
              isLoading ? "text-orange-600" : "text-green-600"
            )}
          >
            {isLoading ? (
              <WifiOff className="h-3 w-3" />
            ) : (
              <Wifi className="h-3 w-3" />
            )}
            <span>
              {isLoading
                ? "Updating..."
                : `Last updated: ${new Date().toLocaleTimeString()}`}
            </span>
          </div>
        </div>
      </div>

      <TripFilters
        filters={filters}
        onFiltersChange={setFilters}
        onConsult={() => refreshTrips()}
        isVisible={showFilters}
      />

      <ColumnVisibilityPanel
        visibility={columnVisibility}
        onVisibilityChange={setColumnVisibility}
        isVisible={showColumnPanel}
      />

      <StatusTabs
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        statusCounts={statusCounts}
      />

      <div className="flex-1">
        {filteredTrips.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">{t("noTripsFound")}</p>
              <p className="text-sm text-muted-foreground">
                {t("tryAdjustingFilters")}
              </p>
            </div>
          </div>
        ) : (
          <Card className="m-4 shadow-lg overflow-hidden">
            <TripTable
              trips={filteredTrips}
              columnVisibility={columnVisibility}
              columnOrder={columnOrder}
              onColumnOrderChange={setColumnOrder}
            />
          </Card>
        )}
      </div>

      <footer className="border-t bg-muted/50 py-4 px-4">
        <div className="text-center text-xs text-muted-foreground">
          {t("title")} • {filteredTrips.length} {t("trips")} • Auto-refresh: 60s
        </div>
      </footer>
    </div>
  );
};

export default Index;
