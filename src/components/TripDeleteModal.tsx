import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trip } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

interface TripDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

export const TripDeleteModal = ({ isOpen, onClose, trip }: TripDeleteModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [motivoExclusao, setMotivoExclusao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setMotivoExclusao('');
    onClose();
  };

  const handleDelete = async () => {
    if (!trip) return;
    
    if (!motivoExclusao.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, escreva o motivo da exclusão."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const deleteData = {
        idViagem: trip.id,
        usuario: "Vitor",
        motivoExclusao: motivoExclusao.trim()
      };

      // URL encode the JSON data
      const encodedData = encodeURIComponent(JSON.stringify(deleteData));
      
      await api.delete(`/api/controlePartida/209/excluirViagem/${encodedData}`);
      
      toast({
        title: "Sucesso",
        description: "Viagem excluída com sucesso!"
      });
      
      handleClose();
    } catch (error) {
      console.error('Erro ao excluir viagem:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir viagem. Tente novamente."
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
            EXCLUIR VIAGEM
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="motivo-exclusao">Escreva uma Observação</Label>
            <Textarea
              id="motivo-exclusao"
              value={motivoExclusao}
              onChange={(e) => setMotivoExclusao(e.target.value)}
              placeholder="Digite o motivo da exclusão..."
              className="min-h-[120px] resize-none"
            />
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
            onClick={handleDelete}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? 'Excluindo...' : 'SALVAR'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};