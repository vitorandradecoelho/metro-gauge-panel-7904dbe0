import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trip } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

interface TripObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

const predefinedMessages = [
  'PROBLEMA GPS',
  'ATRASO NO TRÂNSITO',
  'PROBLEMA MECÂNICO',
  'PASSAGEIRO PROBLEMA',
  'ACIDENTE',
  'OUTROS'
];

export const TripObservationModal = ({ isOpen, onClose, trip }: TripObservationModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState('');
  const [customObservation, setCustomObservation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setSelectedMessage('');
    setCustomObservation('');
    onClose();
  };

  const handleSave = async () => {
    if (!trip) return;
    
    const finalMessage = selectedMessage || customObservation;
    if (!finalMessage.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione uma mensagem predefinida ou escreva uma observação."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const observationData = {
        observacao: {
          dataAtualizacao: new Date().toISOString(),
          mensagem: finalMessage,
          usuarioCriacao: {
            id: 2973,
            nome: "Vitor"
          },
          checkedNotificacao: false,
          viagemData: {
            idViagemExecutada: trip.id,
            data: new Date().toISOString(),
            dataFim: new Date(Date.now() + 3600000).toISOString(), // +1 hour
            dataFormatada: new Date().toLocaleDateString('pt-BR'),
            dataAbertura: new Date().toLocaleString('pt-BR').replace(',', ''),
            dataFechamento: new Date(Date.now() + 3600000).toLocaleString('pt-BR').replace(',', ''),
            idVeiculo: trip.realVehicle || trip.plannedVehicle || "62192",
            veiculoReal: trip.realVehicle || "902145",
            partidaReal: trip.realStart || "00:00:00",
            chegadaReal: trip.realEnd || "01:00:00",
            velocidadeMedia: 38.83,
            duracao: trip.travelTime || "01:00:00",
            duracaoSeg: 3600,
            percentualConclusao: String(trip.completion || 100),
            tipoViagem: 2,
            emExecucao: trip.status === 'EM ANDAMENTO',
            excluido: false,
            kmPlanejado: 0,
            idLinha: "555b4eadaecc1a6638f3ab2b",
            status: 8,
            trajeto: {
              id: "555b4eadaecc1a6638f3ab2a",
              nome: trip.line,
              sentido: trip.route,
              numeroLinha: trip.line.split(' - ')[0] || "10",
              endPoint: {
                id: "555b32f80850536438063665",
                nome: "Terminal Santa Cruz"
              }
            },
            apresentacao: {
              alertaProximo: false,
              classeAlerta: "",
              classeExecucaoViagem: "green",
              classeExecucaoViagemToolTip: "Viagem fechada",
              classeStatusViagem: "white blue-bg min-width"
            },
            mensagemObs: [{
              id: trip.id,
              origem: 1,
              mensagem: finalMessage,
              dataAtualizacao: new Date().toISOString(),
              excluido: false,
              usuarioCriacao: {
                id: 0,
                nome: "Francisco Jose de Sousa Junior - MOBI RIO"
              }
            }],
            idCliente: 209
          }
        },
        viagemId: trip.id
      };

      await api.post('/api/v1/planejamentoViagem/incluirInformacao/209', observationData);
      
      toast({
        title: "Sucesso",
        description: "Observação incluída com sucesso!"
      });
      
      handleClose();
    } catch (error) {
      console.error('Erro ao incluir observação:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao incluir observação. Tente novamente."
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
            INCLUIR OBSERVAÇÃO
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="predefined-message">Mensagem Predefinida</Label>
            <Select value={selectedMessage} onValueChange={setSelectedMessage}>
              <SelectTrigger id="predefined-message">
                <SelectValue placeholder="SELECIONE" />
              </SelectTrigger>
              <SelectContent>
                {predefinedMessages.map((message) => (
                  <SelectItem key={message} value={message}>
                    {message}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-observation">Escreva uma Observação</Label>
            <Textarea
              id="custom-observation"
              value={customObservation}
              onChange={(e) => setCustomObservation(e.target.value)}
              placeholder="Digite sua observação..."
              className="min-h-[120px] resize-none"
              disabled={!!selectedMessage}
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
            onClick={handleSave}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Salvando...' : 'SALVAR'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};