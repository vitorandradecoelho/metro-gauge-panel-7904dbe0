import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import api from '@/services/api';

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditScheduleModal = ({ isOpen, onClose }: EditScheduleModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [operacion, setOperacion] = useState('');
  const [alterarJornada, setAlterarJornada] = useState(false);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleClose = () => {
    setOperacion('');
    setAlterarJornada(false);
    setHoraInicio('');
    setHoraFim('');
    onClose();
  };

  const timeToMs = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return ((hours * 60 + minutes) * 60 + (seconds || 0)) * 1000;
  };

  const handleSave = async () => {
    if (!operacion) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione uma operação."
      });
      return;
    }

    if (operacion === 'Eliminar') {
      setShowDeleteConfirmation(true);
      return;
    }

    if (operacion === 'Editar' && (!horaInicio || !horaFim)) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha os horários de início e fim."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const editData = [{
        data: "2026-08-02",
        idPlanejamento: 406758,
        idTabela: 2696359,
        idHorario: 14087290,
        tipoOperacao: 1,
        idTrajeto: "673766d47ceff1b3d57f8441",
        idCliente: 1351,
        partida: horaInicio + (horaInicio.split(':').length === 2 ? ':00' : ''),
        chegada: horaFim + (horaFim.split(':').length === 2 ? ':00' : ''),
        partidaMs: timeToMs(horaInicio + (horaInicio.split(':').length === 2 ? ':00' : '')),
        chegadaMs: timeToMs(horaFim + (horaFim.split(':').length === 2 ? ':00' : ''))
      }];

      await api.put('/planejamento-viagem-api/v1/dashboard/editarHorario', editData);
      
      toast({
        title: "Sucesso",
        description: "Horário editado com sucesso!"
      });
      
      handleClose();
    } catch (error) {
      console.error('Erro ao editar horário:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao editar horário. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirmation(false);
    setIsLoading(true);
    
    try {
      const deleteData = [
        {
          data: "2026-08-02",
          idPlanejamento: 406758,
          idTabela: 2696359,
          idHorario: 14087289,
          tipoOperacao: 2,
          idTrajeto: "673766d47ceff1b3d57f8441",
          idCliente: 1351
        },
        {
          data: "2026-08-02",
          idPlanejamento: 406758,
          idTabela: 2696359,
          idHorario: 14087290,
          tipoOperacao: 2,
          idTrajeto: "673766d47ceff1b3d57f8441",
          idCliente: 1351
        }
      ];

      await api.put('/planejamento-viagem-api/v1/dashboard/editarHorario', deleteData);
      
      toast({
        title: "Sucesso",
        description: "Horários eliminados com sucesso!"
      });
      
      handleClose();
    } catch (error) {
      console.error('Erro ao eliminar horários:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao eliminar horários. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              EDITAR HORÁRIO
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="operacion">Operación</Label>
              <Select value={operacion} onValueChange={setOperacion}>
                <SelectTrigger id="operacion">
                  <SelectValue placeholder="SELECCIONE" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Editar">Editar</SelectItem>
                  <SelectItem value="Eliminar">Eliminar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {operacion === 'Editar' && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alterar-jornada"
                    checked={alterarJornada}
                    onCheckedChange={(checked) => setAlterarJornada(checked === true)}
                  />
                  <Label htmlFor="alterar-jornada" className="text-sm">
                    Alterar jornada
                  </Label>
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
              </>
            )}
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
              disabled={isLoading || !operacion}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Guardando...' : 'GUARDAR'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-orange-400 flex items-center justify-center">
                <span className="text-orange-400 text-xl font-bold">!</span>
              </div>
            </div>
            <AlertDialogTitle className="text-center text-lg font-semibold">
              ¿Estás seguro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Los horarios de las jornadas se eliminarán:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-2 py-4">
            <div className="grid grid-cols-4 gap-2 text-sm font-medium border-b pb-2">
              <span>Jornada</span>
              <span>Sentido</span>
              <span>Salida</span>
              <span>Llegada</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <span>1a</span>
              <span>CBZ_DUP128</span>
              <span>05:00:00</span>
              <span>06:00:00</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <span>1a</span>
              <span>CBZ_DUP128</span>
              <span>06:00:00</span>
              <span>07:00:00</span>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center gap-2">
            <AlertDialogCancel className="bg-gray-500 hover:bg-gray-600 text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};