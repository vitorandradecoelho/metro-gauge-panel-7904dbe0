interface IEmpresa {
  id: number;
  nome: string;
}

export interface ITrajeto {
  _id: string;
  nome: string;
  sentido: string;
  nomeExibicao: string;
  numeroLinha: string;
  gtfsShapeId: string;
}

export interface ILinha {
  _id: string;
  clienteId: number;
  descr: string;
  numero: string;
  trajetos: ITrajeto[];
  empresas: IEmpresa[];
  consorcio: { consorcioId: number };
  consorcios: { consorcioId: number }[];
  gtfsRouteId: string;
}
