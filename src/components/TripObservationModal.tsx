import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trip } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveModalWrapper } from '@/components/common/ResponsiveModalWrapper';
import { SelectField, TextareaField } from '@/components/common/FormFields';
import { useModalState } from '@/hooks/useModalState';
import { usePredefinedOptions } from '@/hooks/usePredefinedOptions';
import api from '@/services/api';

interface TripObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

export const TripObservationModal = ({ isOpen, onClose, trip }: TripObservationModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isLoading, withLoading } = useModalState();
  const { predefinedMessages } = usePredefinedOptions();
  const [selectedMessage, setSelectedMessage] = useState('');
  const [customObservation, setCustomObservation] = useState('');

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
        title: t('error'),
        description: t('selectMessageOrWrite')
      });
      return;
    }

    await withLoading(async () => {
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
        title: t('success'),
        description: t('observationIncludedSuccess')
      });
      
      handleClose();
    });
  };

  return (
    <ResponsiveModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={t('includeObservation')}
      maxWidth="max-w-md"
    >
      <SelectField
        id="predefined-message"
        label={t('predefinedMessage')}
        value={selectedMessage}
        onChange={setSelectedMessage}
        placeholder={t('select')}
        options={predefinedMessages}
      />

      <TextareaField
        id="custom-observation"
        label={t('writeObservation')}
        value={customObservation}
        onChange={setCustomObservation}
        placeholder={t('typeObservation')}
        disabled={!!selectedMessage}
      />

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isLoading}
          className="order-2 sm:order-1"
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 order-1 sm:order-2"
        >
          {isLoading ? t('saving') : t('save')}
        </Button>
      </div>
    </ResponsiveModalWrapper>
  );
};