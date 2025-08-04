import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, X } from 'lucide-react';

interface TripRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (tripData: any) => void;
}

export const TripRegistrationModal = ({ isOpen, onClose, onSave }: TripRegistrationModalProps) => {
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

  const handleSave = () => {
    console.log('Salvando viagem:', formData);
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  const handleSaveAndAllocate = () => {
    const dataWithAllocation = { ...formData, alocarViagem: true };
    console.log('Salvando e alocando viagem:', dataWithAllocation);
    if (onSave) {
      onSave(dataWithAllocation);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-primary text-primary-foreground p-4 -m-6 mb-6">
          <DialogTitle className="flex items-center justify-between">
            <span>CADASTRAR VIAGEM</span>
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
          </div>

          {/* Trajeto */}
          <div>
            <Label htmlFor="trajeto" className="text-sm font-medium">
              Trajeto <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.trajeto} onValueChange={(value) => setFormData({ ...formData, trajeto: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Consulte pelo trajeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="terminal-centro">Terminal - Centro</SelectItem>
                <SelectItem value="centro-terminal">Centro - Terminal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Inicial e Final */}
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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

        <div className="flex justify-end gap-3 pt-4 border-t">
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