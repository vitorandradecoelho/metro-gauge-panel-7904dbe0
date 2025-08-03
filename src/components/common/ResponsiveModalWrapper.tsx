import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReactNode } from 'react';

interface ResponsiveModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

export const ResponsiveModalWrapper = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-2xl',
  className = ''
}: ResponsiveModalWrapperProps) => {
  const isMobile = useIsMobile();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${maxWidth} ${
          isMobile 
            ? 'w-[95vw] max-h-[90vh] m-4' 
            : 'max-h-[90vh]'
        } overflow-y-auto ${className}`}
      >
        <DialogHeader className="bg-primary text-primary-foreground p-4 -m-6 mb-6 sticky top-0 z-10">
          <DialogTitle className="flex items-center justify-between text-base sm:text-lg">
            <span>{title}</span>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className={`space-y-4 ${isMobile ? 'px-2' : ''}`}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};