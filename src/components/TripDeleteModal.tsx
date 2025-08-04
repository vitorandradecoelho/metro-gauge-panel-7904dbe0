import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trip } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveModalWrapper } from '@/components/common/ResponsiveModalWrapper';
import { TextareaField } from '@/components/common/FormFields';
import { useModalState } from '@/hooks/useModalState';
import api from '@/services/api';

interface TripDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

export const TripDeleteModal = ({ isOpen, onClose, trip }: TripDeleteModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isLoading, withLoading } = useModalState();
  const [motivoExclusao, setMotivoExclusao] = useState('');

  const handleClose = () => {
    setMotivoExclusao('');
    onClose();
  };

  const handleDelete = async () => {
    if (!trip) return;
    
    if (!motivoExclusao.trim()) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('writeDeletionReason')
      });
      return;
    }

    await withLoading(async () => {
      const deleteData = {
        idViagem: trip.id,
        usuario: "Vitor",
        motivoExclusao: motivoExclusao.trim()
      };

      // URL encode the JSON data
      const encodedData = encodeURIComponent(JSON.stringify(deleteData));
      
      await api.delete(`/api/controlePartida/209/excluirViagem/${encodedData}`);
      
      toast({
        title: t('success'),
        description: t('tripDeletedSuccess')
      });
      
      handleClose();
    });
  };

  return (
    <ResponsiveModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={t('deleteTrip')}
      maxWidth="max-w-md"
    >
      <TextareaField
        id="motivo-exclusao"
        label={t('writeObservation')}
        value={motivoExclusao}
        onChange={setMotivoExclusao}
        placeholder={t('typeDeletionReason')}
        required
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
          onClick={handleDelete}
          disabled={isLoading}
          variant="destructive"
          className="order-1 sm:order-2"
        >
          {isLoading ? t('deleting') : t('save')}
        </Button>
      </div>
    </ResponsiveModalWrapper>
  );
};