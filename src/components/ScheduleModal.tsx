import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import api from '@/services/api';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal = ({ isOpen, onClose }: ScheduleModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [servico, setServico] = useState('');
  const [ruta, setRuta] = useState('');
  const [jornada, setJornada] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setServico('');
    setRuta('');
    setJornada('');
    setHoraInicio('');
    setHoraFim('');
    onClose();
  };

  const timeToMs = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return ((hours * 60 + minutes) * 60 + (seconds || 0)) * 1000;
  };

  const handleSave = async () => {
    if (!servico || !ruta || !jornada || !horaInicio || !horaFim) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const scheduleData = {
        data: "2026-08-02",
        idPlanejamento: 406758,
        idTabela: 2696359,
        idTrajeto: "673766d47ceff1b3d57f8441",
        idCliente: 1351,
        tipoOperacao: 0,
        partida: horaInicio + (horaInicio.split(':').length === 2 ? ':00' : ''),
        chegada: horaFim + (horaFim.split(':').length === 2 ? ':00' : ''),
        partidaMs: timeToMs(horaInicio + (horaInicio.split(':').length === 2 ? ':00' : '')),
        chegadaMs: timeToMs(horaFim + (horaFim.split(':').length === 2 ? ':00' : ''))
      };

      await api.post('/planejamento-viagem-api/v1/dashboard/incluirHorario', scheduleData);
      
      toast({
        title: "Sucesso",
        description: "Horário incluído com sucesso!"
      });
      
      handleClose();
    } catch (error) {
      console.error('Erro ao incluir horário:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao incluir horário. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            INCLUIR HORÁRIO
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="servico">Serviço</Label>
            <Select value={servico} onValueChange={setServico}>
              <SelectTrigger id="servico">
                <SelectValue placeholder="T510" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T510">T510</SelectItem>
                <SelectItem value="T511">T511</SelectItem>
                <SelectItem value="T512">T512</SelectItem>
                <SelectItem value="T513">T513</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ruta">Ruta</Label>
            <Select value={ruta} onValueChange={setRuta}>
              <SelectTrigger id="ruta">
                <SelectValue placeholder="T51000I" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T51000I">T51000I</SelectItem>
                <SelectItem value="T51000V">T51000V</SelectItem>
                <SelectItem value="T51001I">T51001I</SelectItem>
                <SelectItem value="T51001V">T51001V</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jornada">Jornada</Label>
            <Select value={jornada} onValueChange={setJornada}>
              <SelectTrigger id="jornada">
                <SelectValue placeholder="1a" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1a">1a</SelectItem>
                <SelectItem value="1b">1b</SelectItem>
                <SelectItem value="2a">2a</SelectItem>
                <SelectItem value="2b">2b</SelectItem>
                <SelectItem value="3a">3a</SelectItem>
                <SelectItem value="3b">3b</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hora-inicio">Hora Início</Label>
              <div className="relative">
                <Input
                  id="hora-inicio"
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="pr-8"
                />
                <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora-fim">Hora Fim</Label>
              <div className="relative">
                <Input
                  id="hora-fim"
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  className="pr-8"
                />
                <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            CANCELAR
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Guardando...' : 'GUARDAR'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};