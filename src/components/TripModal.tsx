import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TripModal = ({ isOpen, onClose }: TripModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('details')}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-8">
          <p className="text-2xl font-bold text-primary">{t('hello')}</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};