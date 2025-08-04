import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ApiPrefix } from "@/constants/m2mconfig";
import api from "@/services/api";
import { getClienteLocalStorage } from "@/services/localStorage";
import { Trip } from "@/types/trip";
import { Vehicle } from "@/types/vehicle";
import { useTrips } from "@/hooks/useTrips";

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

export const TripModal = ({ isOpen, onClose, trip }: TripModalProps) => {
  const clienteLocalStorage = getClienteLocalStorage();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { lines, filters } = useTrips();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(
    {} as Vehicle
  );
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [dragOption, setDragOption] = useState("1");

  const getRoutes = (): string[] => {
    let routes = [];
    lines?.forEach((line) => {
      line?.trajetos.forEach((route) => {
        if (trip.rawRoute.id === route._id) {
          routes = line.trajetos;
        }
      });
    });

    return routes.map((t) => {
      return t._id;
    });
  };

  const handleSave = async () => {
    if (!selectedVehicle.cod_veiculo) {
      toast({
        title: t("saveError"),
        description: t("vehicle") + " é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const data = {
      dataInicio: filters.startDate,
      gmtCliente: clienteLocalStorage?.gmtCliente,
      horaInicial: filters.startTime,
      horario: trip.plannedStart,
      idPlanejamento: Number(trip.plannedId).toString(),
      nome: clienteLocalStorage?.nomeUsuario,
      somenteEsteHorario: Number(dragOption) === 1 ? true : null,
      tabelaId: trip.tab,
      trajetos: Number(dragOption) === 3 ? getRoutes() : [trip.rawRoute.id],
      veiculo: selectedVehicle,
      veiculosAuditoria: [selectedVehicle.cod_veiculo],
    };

    try {
      const response = await api.post<any>(
        `${ApiPrefix.SERVICE_API}/arrastomanualnovo/arrastarParaVariosTrajetosDashboard/${clienteLocalStorage?.idCliente}`,
        data
      );
      if (response) {
        toast({
          title: t("dragSaveSuccessfull"),
        });

        onClose();
      }
    } catch (e) {
      toast({
        title: t("saveError"),
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleChangeVeiculo = (veic: any) => {
    const vehicle = vehicles.find((veh: Vehicle) => veh.cod_veiculo === veic);

    setSelectedVehicle(vehicle);
  };

  const setInitialValues = () => {
    setSelectedLine(trip.lineNumber);
    setSelectedTab(trip.tab);
    setSelectedRoute(trip.line);
  };

  useEffect(() => {
    async function consultarDashboard() {
      try {
        const response = await api.get<any>(
          `${ApiPrefix.SERVICE_API}/veiculo/consultarVeiculosDashboard/${clienteLocalStorage?.idCliente}/${trip?.plannedId}/${trip?.tabId}`
        );
        setVehicles(response.data);
      } catch (e) {
        toast({ title: "Erro ao buscar dados" });
      }
    }

    if (isOpen) {
      consultarDashboard();
      setInitialValues();
    }
  }, [isOpen, trip]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-700 text-white border-slate-600">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-white font-medium">
            {t("actionCenter")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-4">{t("dragVehicle")}</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-white text-sm mb-2 block">
                  {t("vehicle")}
                </Label>
                <Select
                  value={selectedVehicle.cod_veiculo}
                  onValueChange={handleChangeVeiculo}
                >
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-600 border-slate-500">
                    {vehicles.map((vehicle: Vehicle) => (
                      <SelectItem
                        key={vehicle.id_veiculo}
                        value={vehicle.cod_veiculo}
                        className="text-white hover:bg-slate-500"
                      >
                        {vehicle.cod_veiculo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-sm mb-2 block">
                  {t("line")}
                </Label>
                <div className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white h-10">
                  {selectedLine}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-white text-sm mb-2 block">
                  {t("route")}
                </Label>
                <div className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm">
                  {selectedRoute}
                </div>
              </div>

              <div>
                <Label className="text-white text-sm mb-2 block">
                  {t("tab")}
                </Label>
                <div className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white">
                  {selectedTab}
                </div>
              </div>
            </div>

            <RadioGroup
              value={dragOption}
              onValueChange={setDragOption}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="1"
                  id="current-time"
                  className="border-white text-white"
                />
                <Label htmlFor="current-time" className="text-white text-sm">
                  {t("dragCurrentTime")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="2"
                  id="from-time"
                  className="border-white text-white"
                />
                <Label htmlFor="from-time" className="text-white text-sm">
                  {t("dragFromTime")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="3"
                  id="same-table"
                  className="border-white text-white"
                />
                <Label htmlFor="same-table" className="text-white text-sm">
                  {t("dragSameTable")}
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
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {t("save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
