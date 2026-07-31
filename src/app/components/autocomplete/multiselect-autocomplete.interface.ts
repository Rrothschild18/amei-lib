export type AutocompleteOption = {
  label: string;
  value: number | string;
  selected?: boolean;
};

export type AutocompleteConfig = {
  [key: string | number]: AutocompleteOption;
};

//IGNORE

export interface IExpertiseAreaFromApi {
  id: number;
  descricao: string;
  procedimentos: IProcedureFromApi[];
  rqe?: string | null;
  ativo: boolean;
}

export interface IProcedureListFromApi {
  items: IProcedureFromApi[];
  meta: {
    [key: string]: any;
  };
}
export interface IProcedureFromApi {
  id: number;
  nome: string;
  nomeTecnico: string;
  sinonimos: string;
  sigla: string;
  codCbhpm: string;
  atendimentoGrupo: boolean;
  maxPacientes: number;
  duracao: string;
  encaixe: boolean;
  obrigarPreenchProfissional: boolean;
  integracao_laboratorial: boolean;
  duplicidade_proposta: string;
  telemedicina: boolean;
  pagamentoOnline: boolean;
  avisosAgenda: string;
  preparo: string;
  ativo: boolean;
  codigoTuss: string | null;
  procedimentoSeriado: boolean | null;
  obrigarRespeitarTempo: boolean | null;
  naoPermitirDuplicidadeProposta: boolean | null;
  exibirAgendamentoOnline: boolean | null;
  alteracaoPrecoUnidades: boolean | null;
  naoNecessitaAgendamento: boolean | null;
  precificacaoVendaPadronizada: boolean;
  valorCustoPadronizado: boolean;
}
