import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, X } from 'lucide-react';
import { Trip } from '@/types/trip';
import { useToast } from '@/hooks/use-toast';
import { useTrips } from '@/hooks/useTrips';
import Swal from 'sweetalert2';

interface TripRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (tripData: any) => void;
  trip?: Trip | null;
}

export const TripRegistrationModal = ({ isOpen, onClose, onSave, trip }: TripRegistrationModalProps) => {
  const { toast } = useToast();
  const { editTrip } = useTrips();
  const [formData, setFormData] = useState({
    linha: '',
    trajeto: '',
    dataInicial: '',
    horaInicial: '00:00:00',
    dataFinal: '',
    horaFinal: '23:59:59',
    veiculo: '',
    motorista: '',
    chegadaAoPonto: '',
    horaChegada: '',
    quantidadePassageiros: '',
    motivosPredefinidos: '',
    observacao: '',
    alocarViagem: false,
  });

  // Helper function to convert date from DD/MM/YYYY to YYYY-MM-DD
  const convertDateFormat = (date: string) => {
    if (!date) return '';
    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return date;
  };

  useEffect(() => {
    if (trip && isOpen) {
      // Populate form with trip data when editing
      const convertedDate = convertDateFormat(trip.date || '');
      setFormData({
        linha: trip.line || '',
        trajeto: trip.route === 'ida' ? 'Ida' : trip.route === 'volta' ? 'Volta' : trip.route || '',
        dataInicial: convertedDate,
        horaInicial: trip.plannedStart || '00:00:00',
        dataFinal: convertedDate,
        horaFinal: trip.plannedEnd || '23:59:59',
        veiculo: trip.plannedVehicle || trip.realVehicle || '',
        motorista: trip.driver || '',
        chegadaAoPonto: convertedDate,
        horaChegada: trip.realStart || trip.plannedStart || '',
        quantidadePassageiros: trip.passengers?.toString() || '',
        motivosPredefinidos: 'MANOBRA OPERACIONAL',
        observacao: '',
        alocarViagem: false,
      });
      console.log('Preenchendo formulário com dados da viagem:', {
        trip,
        formData: {
          linha: trip.line,
          trajeto: trip.route,
          dataInicial: trip.date,
          veiculo: trip.plannedVehicle || trip.realVehicle,
          motorista: trip.driver,
          passageiros: trip.passengers
        }
      });
    } else if (!trip && isOpen) {
      // Reset form for new trip
      setFormData({
        linha: '',
        trajeto: '',
        dataInicial: '',
        horaInicial: '00:00:00',
        dataFinal: '',
        horaFinal: '23:59:59',
        veiculo: '',
        motorista: '',
        chegadaAoPonto: '',
        horaChegada: '',
        quantidadePassageiros: '',
        motivosPredefinidos: '',
        observacao: '',
        alocarViagem: false,
      });
    }
  }, [trip, isOpen]);

  const validateArrivalTime = () => {
    if (!formData.chegadaAoPonto || !formData.horaChegada || !formData.dataInicial || !formData.horaInicial) {
      return true; // Skip validation if required fields are empty
    }

    const arrivalDateTime = new Date(`${formData.chegadaAoPonto}T${formData.horaChegada}`);
    const tripStartDateTime = new Date(`${formData.dataInicial}T${formData.horaInicial}`);
    
    // Calculate difference in hours
    const diffInMs = tripStartDateTime.getTime() - arrivalDateTime.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    return diffInHours >= 2;
  };

  const showArrivalTimeAlert = async () => {
    const result = await Swal.fire({
      title: 'Atenção',
      text: 'A chegada ao ponto é anterior a 02h do início da viagem, deseja continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonColor: '#8B5CF6',
      cancelButtonColor: '#6B7280',
      background: '#1F2937',
      color: '#F9FAFB',
      customClass: {
        popup: 'swal-dark-theme'
      }
    });
    
    return result.isConfirmed;
  };

  const handleSave = async () => {
    // Check arrival time validation for trip editing
    if (trip && !validateArrivalTime()) {
      const shouldContinue = await showArrivalTimeAlert();
      if (!shouldContinue) {
        return; // User chose not to continue
      }
    }

    if (trip) {
      await handleEditTrip(false);
    } else {
      console.log('Salvando viagem:', formData);
      if (onSave) {
        onSave(formData);
      }
      onClose();
    }
  };

  const handleSaveAndAllocate = async () => {
    // Check arrival time validation for trip editing
    if (trip && !validateArrivalTime()) {
      const shouldContinue = await showArrivalTimeAlert();
      if (!shouldContinue) {
        return; // User chose not to continue
      }
    }

    if (trip) {
      await handleEditTrip(true);
    } else {
      const dataWithAllocation = { ...formData, alocarViagem: true };
      console.log('Salvando e alocando viagem:', dataWithAllocation);
      if (onSave) {
        onSave(dataWithAllocation);
      }
      onClose();
    }
  };

  const handleEditTrip = async (allocate: boolean = false) => {
    try {
      const editData = {
        inicio: `${formData.dataInicial} ${formData.horaInicial}`,
        fim: `${formData.dataFinal} ${formData.horaFinal}`,
        linha: {
          _id: "555b4eadaecc1a6638f3ab2b",
          clienteId: 209,
          descr: trip?.line || "",
          numero: "10",
          gtfsRouteId: "20000101130",
          trajetos: [],
          veiculos: [],
          empresas: [],
          consorcio: { consorcioId: 39, consorcio: "TransOeste" },
          consorcios: [{ _id: "687f850f561b4717c6d8651e", consorcio: "TransOeste", consorcioId: 39 }],
          inverterLinha: false,
          id: "555b4eadaecc1a6638f3ab2b"
        },
        trajeto: {
          sentido: "volta",
          wayPoints: [],
          kmTrajeto: 38.83,
          gtfsShapeId: "v2bf",
          endPoint: { _id: "555b32f80850536438063665", nome: "Terminal Santa Cruz" },
          startPoint: { gps: { type: "Point", coordinates: [-43.36510509252549, -23.000987268667515] } },
          nome: "10 - ALVORADA X SANTA CRUZ (EXPRESSO) [VOLTA]",
          _id: "555b4eadaecc1a6638f3ab2a",
          nomeExibicao: "10 - ALVORADA X SANTA CRUZ (EXPRESSO) [VOLTA]",
          numeroLinha: "10"
        },
        veiculo: {
          id_veiculo: 15328,
          id_veiculo_tipo: 1,
          id_cliente: 209,
          id_empresa: 2580,
          cod_veiculo: "901011",
          vl_prefixo: "901011",
          vl_placa: "RIV8A74",
          empresa: {
            empresaId: 2580,
            nomeEmpresa: "UNIDADE 2",
            identificador: "22"
          }
        },
        motivo: "MANOBRA OPERACIONAL",
        mensagemObs: {
          mensagem: formData.observacao || "MANOBRA OPERACIONAL",
          dataAtualizacao: new Date().toISOString().replace('T', ' ').slice(0, -5),
          usuarioCriacao: "vitor.coelho"
        },
        nomeUsuario: "Vitor",
        transmissao: {
          idPontoInteresse: "57913be9d4ca5bcc77cde4bd",
          transmissao: {
            gps: { coordinates: [-43.36510509252549, -23.000987268667515] },
            dataTransmissao: `${formData.dataInicial} 00:00:00`
          },
          eventoTransmissao: 2,
          idTrajeto: "555b4eadaecc1a6638f3ab2a"
        },
        alocada: allocate,
        idPlanejamento: "385768",
        horarioInicioProgramado: new Date(`${formData.dataInicial}T${formData.horaInicial}`).toISOString(),
        horarioFimProgramado: new Date(`${formData.dataFinal}T${formData.horaFinal}`).toISOString(),
        toleranciaAdiantamento: 2,
        toleranciaAtraso: 5,
        idHorario: 13395866,
        Func: "edicao_viagem",
        nomeCliente: "MOBI RIO",
        idCliente: "209",
        id_usuario: "2973"
      };

      await editTrip(editData);
      
      toast({
        title: "Viagem editada com sucesso",
        description: allocate ? "Viagem editada e alocada" : "Viagem editada",
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao editar viagem:', error);
      toast({
        title: "Erro ao editar viagem",
        description: "Ocorreu um erro ao tentar editar a viagem",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader className="bg-primary text-primary-foreground p-4 -m-6 mb-6">
          <DialogTitle className="flex items-center justify-between">
            <span>{trip ? 'EDITAR VIAGEM' : 'CADASTRAR VIAGEM'}</span>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Linha */}
          <div>
            <Label htmlFor="linha" className="text-sm font-medium">
              Linha <span className="text-red-500">*</span>
            </Label>
            {trip ? (
              <Input
                id="linha"
                value={formData.linha}
                disabled
                className="mt-1 bg-muted"
              />
            ) : (
              <Select value={formData.linha} onValueChange={(value) => setFormData({ ...formData, linha: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Consulte pela linha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linha01">Linha 01</SelectItem>
                  <SelectItem value="linha02">Linha 02</SelectItem>
                  <SelectItem value="linha03">Linha 03</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Trajeto */}
          <div>
            <Label htmlFor="trajeto" className="text-sm font-medium">
              Trajeto <span className="text-red-500">*</span>
            </Label>
            {trip ? (
              <Input
                id="trajeto"
                value={formData.trajeto}
                disabled
                className="mt-1 bg-muted"
              />
            ) : (
              <Select value={formData.trajeto} onValueChange={(value) => setFormData({ ...formData, trajeto: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Consulte pelo trajeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terminal-centro">Terminal - Centro</SelectItem>
                  <SelectItem value="centro-terminal">Centro - Terminal</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Data Inicial e Final */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataInicial" className="text-sm font-medium">Data Inicial:</Label>
              <div className="relative mt-1">
                <Input
                  id="dataInicial"
                  type="date"
                  value={formData.dataInicial}
                  onChange={(e) => setFormData({ ...formData, dataInicial: e.target.value })}
                  className="pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative mt-2">
                <Input
                  type="time"
                  value={formData.horaInicial}
                  onChange={(e) => setFormData({ ...formData, horaInicial: e.target.value })}
                  className="pr-10"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="dataFinal" className="text-sm font-medium">Data Final:</Label>
              <div className="relative mt-1">
                <Input
                  id="dataFinal"
                  type="date"
                  value={formData.dataFinal}
                  onChange={(e) => setFormData({ ...formData, dataFinal: e.target.value })}
                  className="pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative mt-2">
                <Input
                  type="time"
                  value={formData.horaFinal}
                  onChange={(e) => setFormData({ ...formData, horaFinal: e.target.value })}
                  className="pr-10"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Veículo e Motorista */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="veiculo" className="text-sm font-medium">Veículo</Label>
              <Select value={formData.veiculo} onValueChange={(value) => setFormData({ ...formData, veiculo: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veiculo001">Veículo 001</SelectItem>
                  <SelectItem value="veiculo002">Veículo 002</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="motorista" className="text-sm font-medium">Motorista</Label>
              <Select value={formData.motorista} onValueChange={(value) => setFormData({ ...formData, motorista: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione um" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motorista1">João Silva</SelectItem>
                  <SelectItem value="motorista2">Maria Santos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chegada ao ponto */}
          <div>
            <Label htmlFor="chegadaAoPonto" className="text-sm font-medium">Chegada ao ponto:</Label>
            <div className="relative mt-1">
              <Input
                id="chegadaAoPonto"
                type="date"
                value={formData.chegadaAoPonto}
                onChange={(e) => setFormData({ ...formData, chegadaAoPonto: e.target.value })}
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="relative mt-2">
              <Input
                type="time"
                placeholder="hh:mm:ss"
                value={formData.horaChegada}
                onChange={(e) => setFormData({ ...formData, horaChegada: e.target.value })}
                className="pr-10"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Switch para Alocar Viagem */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <Label htmlFor="alocarViagem" className="text-sm font-medium">Alocar Viagem</Label>
            <Switch
              id="alocarViagem"
              checked={formData.alocarViagem}
              onCheckedChange={(checked) => setFormData({ ...formData, alocarViagem: checked })}
            />
          </div>

          {/* Quantidade de Passageiros */}
          <div>
            <Label htmlFor="quantidadePassageiros" className="text-sm font-medium">Quantidade de Passageiros</Label>
            <Input
              id="quantidadePassageiros"
              type="number"
              placeholder="Quantidade de Passageiros"
              value={formData.quantidadePassageiros}
              onChange={(e) => setFormData({ ...formData, quantidadePassageiros: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Motivos Predefinidos */}
          <div>
            <Label htmlFor="motivosPredefinidos" className="text-sm font-medium">Motivos Predefinidos</Label>
            <Select value={formData.motivosPredefinidos} onValueChange={(value) => setFormData({ ...formData, motivosPredefinidos: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atraso">Atraso</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
                <SelectItem value="reforco">Reforço</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observação */}
          <div>
            <Label htmlFor="observacao" className="text-sm font-medium">Observação</Label>
            <Textarea
              id="observacao"
              placeholder="Observação"
              value={formData.observacao}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              className="mt-1 min-h-[100px]"
            />
          </div>

          <p className="text-sm text-muted-foreground italic">*Campos Obrigatórios</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button 
            onClick={handleSaveAndAllocate}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            SALVAR + ALOCAR
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
          >
            SALVAR
          </Button>
          <Button variant="outline" onClick={onClose}>
            CANCELAR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};