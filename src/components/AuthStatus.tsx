import { useEffect, useState } from 'react';
import { User, Shield, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getClienteLocalStorage, isAuthenticated } from '@/services/localStorage';

interface ICliente {
  idCliente: number;
  gmtCliente: string;
  nomeUsuario: string;
  idUsuario: string;
  empresas: number[];
  acessos: object[];
  inicioDiaOperacional: string;
}

export const AuthStatus = () => {
  const [cliente, setCliente] = useState<ICliente | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthenticated(auth);
      
      if (auth) {
        const clientData = getClienteLocalStorage();
        setCliente(clientData);
      }
    };

    checkAuth();
  }, []);

  if (!authenticated) {
    return (
      <Card className="mb-4 border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800">Modo de desenvolvimento</p>
              <p className="text-xs text-orange-600">Usando dados de demonstração</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cliente) {
    return null;
  }

  return (
    <Card className="mb-4 border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                {cliente.nomeUsuario || 'Usuário Autenticado'}
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600">
                <span>Cliente: {cliente.idCliente}</span>
                {cliente.gmtCliente && (
                  <>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{cliente.gmtCliente}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {cliente.empresas.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {cliente.empresas.length} empresa(s)
              </Badge>
            )}
            <Badge variant="default" className="text-xs bg-green-600">
              Autenticado
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};