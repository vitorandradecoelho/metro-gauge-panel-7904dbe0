import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, X } from 'lucide-react';
import { TripRegistrationModal } from '@/components/TripRegistrationModal';

const TripEdit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    empresa: '',
    linha: '',
    veiculo: '',
    trajeto: '',
    dataPartida: '',
    horaPartida: '',
    dataChegada: '',
    horaChegada: '',
    excluidas: false,
    canceladas: false
  });

  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleLimpar = () => {
    setFilters({
      empresa: '',
      linha: '',
      veiculo: '',
      trajeto: '',
      dataPartida: '',
      horaPartida: '',
      dataChegada: '',
      horaChegada: '',
      excluidas: false,
      canceladas: false
    });
  };

  const handleConsultar = () => {
    console.log('Consultando viagens com filtros:', filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="max-w-7xl mx-auto">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-xl font-bold flex items-center justify-between">
            <span>EDIÇÃO DE VIAGEM</span>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => window.history.back()}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Filtro</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Empresa */}
              <div>
                <label className="block text-sm font-medium mb-2">Empresa</label>
                <Select value={filters.empresa} onValueChange={(value) => handleFilterChange('empresa', value)}>
                  <SelectTrigger className="bg-primary text-primary-foreground">
                    <SelectValue placeholder="Empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empresa1">Empresa 1</SelectItem>
                    <SelectItem value="empresa2">Empresa 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Linha */}
              <div>
                <label className="block text-sm font-medium mb-2">Linha *</label>
                <Select value={filters.linha} onValueChange={(value) => handleFilterChange('linha', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Consulte pel..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linha1">Linha 01</SelectItem>
                    <SelectItem value="linha2">Linha 02</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Veículo */}
              <div>
                <label className="block text-sm font-medium mb-2">Veículo *</label>
                <Select value={filters.veiculo} onValueChange={(value) => handleFilterChange('veiculo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veiculo1">Veículo 001</SelectItem>
                    <SelectItem value="veiculo2">Veículo 002</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trajeto */}
              <div>
                <label className="block text-sm font-medium mb-2">Trajeto</label>
                <Select value={filters.trajeto} onValueChange={(value) => handleFilterChange('trajeto', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Consulte pel..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trajeto1">Terminal - Centro</SelectItem>
                    <SelectItem value="trajeto2">Centro - Terminal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Partida</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="date"
                      value={filters.dataPartida}
                      onChange={(e) => handleFilterChange('dataPartida', e.target.value)}
                      className="pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="relative flex-1">
                    <Input
                      type="time"
                      value={filters.horaPartida}
                      onChange={(e) => handleFilterChange('horaPartida', e.target.value)}
                      className="pr-10"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Chegada</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="date"
                      value={filters.dataChegada}
                      onChange={(e) => handleFilterChange('dataChegada', e.target.value)}
                      className="pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="relative flex-1">
                    <Input
                      type="time"
                      value={filters.horaChegada}
                      onChange={(e) => handleFilterChange('horaChegada', e.target.value)}
                      className="pr-10"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros adicionais */}
            <div className="flex gap-4 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.excluidas}
                  onChange={(e) => handleFilterChange('excluidas', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Excluídas</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.canceladas}
                  onChange={(e) => handleFilterChange('canceladas', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Canceladas</span>
              </label>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 justify-end">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6"
              >
                + INCLUIR VIAGEM
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLimpar}
                className="px-6"
              >
                LIMPAR
              </Button>
              <Button 
                onClick={handleConsultar}
                className="bg-primary hover:bg-primary/90 px-6"
              >
                CONSULTAR
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TripRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TripEdit;