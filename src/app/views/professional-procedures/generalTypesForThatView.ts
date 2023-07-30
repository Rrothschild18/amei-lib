import { AutocompleteOption } from 'src/app/components/autocomplete/multiselect-autocomplete.interface';

export interface IExpertiseArea {
  id: number;
  description: string;
  procedures: any[];
  rqe?: string | null;
}

export interface HeaderRequest {
  headers: {
    Authorization: string;
  };
}

// Procedure
export interface ProcedureFilterParam {
  page: number;
  limit: number;
  name?: string;
  procedure?: string;
  groupId?: number;
  group?: string;
  typeId?: number;
  professional?: string;
  professionalId?: number;
  type?: string;
  especialidade?: string | number;
  specialtyIds?: string | number;
  active?: string;
  id?: string | number;
}
export interface FilterGroupProcedure {
  groupId?: number | null;
}
export interface ProcedureFilterParamTypeProcedures {
  tipoId?: number;
  grupoIds?: number;
  procedimentoId?: number;
}

export interface ProcedureFilterParamTypeProceduresByUnit {
  name?: string;
}
export interface ProcedureFilterParamTypeProcedurePrice {
  procedimentoId: number;
  pricingId: number;
}

export interface ProcedureFilterWithoutPagination {
  name?: string;
  group?: string;
  groupId?: string;
  typeId?: string;
  type?: string;
  especialidade?: string | number;
  specialtyIds?: string | number;
  active?: string;
}

export interface ProcedureTypeFilterParam {
  page: number;
  limit: number;
  typeName?: string;
  typeId?: string | number;
  areaAtuacaoId?: number;
  active?: boolean;
}

export interface ProcedureFilterResonse {
  items: IProcedureFromApi[];
  meta: Meta;
}

export interface IProcedureToApi {
  id: number;
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
  flgNecessitaAcolhimento: number;
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
  precificacaoSegmentada: boolean | null;
  naoNecessitaAgendamento: boolean | null;
  precificacaoVendaPadronizada: boolean;
  valorCustoPadronizado: boolean;
  especialidades: IExpertiseAreaSimpleFromApi[];
  tipo: IProcedureTypeSimpleFromApi;
  grupo: IProcedureGroupFromApi[];

  // locais?: ILocationFromApi[];
  unidades: IUnitSimpleFromAPI[];

  // partnersTable:
  valorVenda?: number;
}
export interface Procedimento {
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
  flgNecessitaAcolhimento: number;
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
  precificacaoSegmentada: boolean | null;
  naoNecessitaAgendamento: boolean | null;
  precificacaoVendaPadronizada: boolean;
  valorCustoPadronizado: boolean;
  especialidades: IExpertiseAreaSimpleFromApi[];
  tipo: IProcedureTypeSimpleFromApi;
  grupos: IProcedureGroupFromApi[];

  // locais?: ILocationFromApi[];
  unidades: IUnitSimpleFromAPI[];
}

export interface IProcedureUnit {
  id: number;
  id_fornecedor: number;
  fornecedor: string;
  id_procedimento: number;
  procedimento: string;
  id_tabela: number;
  tabela: string;
  valor_custo: number;
  valor_venda: number;
  codigo_procedimento: string;
  id_grupo_procedimento: number;
  grupo_procedimento: string;
  id_unidade: number;
  unidade: string;
  grupos: IProcedureGroupFromApi[];
}

export interface IProcedimentoByUnit {
  id: number;
  nome: string;
}

export interface IProcedureSimpleFromApi {
  id: number;
  nome: string;
  nomeTecnico: string;
  sinonimos: string;
  sigla: string;
  grupo?: IProcedureGroupFromApi[];
  codCbhpm: string;
  atendimentoGrupo: boolean;
  maxPacientes: number;
  duracao: string;
  flgNecessitaAcolhimento: number;
  encaixe: boolean;
  obrigarPreenchProfissional: boolean;
  integracao_laboratorial: boolean;
  duplicidade_proposta: string;
  telemedicina: boolean;
  pagamentoOnline: boolean;
  avisosAgenda: string;
  preparo: string;
  ativo: boolean;
  codigoTuss: null | string;
  procedimentoSeriado: boolean | null;
  obrigarRespeitarTempo: boolean | null;
  naoPermitirDuplicidadeProposta: boolean | null;
  exibirAgendamentoOnline: boolean | null;
  precificacaoSegmentada: boolean | null;
  naoNecessitaAgendamento: boolean | null;
  especialidades?: IExpertiseAreaSimpleFromApi[];
  // locais?: ILocationFromApi[];
}

// export interface ILocationFromApi {
//   id: number;
//   descricao: string;
//   clinica: IClinicFromApi;
// }

export interface IClinicFromApi {
  id: number;
  descricao: string;
  flgCentral: string;
}

// export interface Especialidades {
//   id: number;
//   descricao?: string;
//   ativo: boolean;
//   rqe?: string;
// }

export interface IProcedure {
  id: number;
  name: string;
  serviceGroup: boolean;
  active: boolean;
  noticesSchedule: string;
  codCbhpm: string;
  proposalDuplicate: string;
  duration: string;
  fit: boolean;
  group: string;
  laboratoryIntegration: boolean;
  locations: ILocation[];
  maxPatients: number;
  technicalName: string;
  obligeFillProfessional: boolean;
  onlinePayment: boolean;
  preparation: string;
  acronym: string;
  synonyms: string;
  telemedicine: boolean;
}

export interface ILocation {
  id: number;
  description: string;
  clinic: IClinic;
}

export interface IClinic {
  id: number;
  description: string;
}

export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface IProcedureFilteredOption {
  id: number;
  name: string;
}

// Procedure Type
export interface IProcedureTypeResponse {
  items: IProcedureTypeFromApi[];
  meta: Meta;
}

export interface IProcedureTypeRequestParam {
  page: number;
  limit: number;
  typeName?: string;
  typeId?: string | number;
  active?: boolean;
  areaAtuacaoId?: number;
}

export interface IProcedureTypeFromApi {
  id: number;
  descricao: string;
  status: boolean;
  procGrupos: Groups[];
}

export interface IProcedureTypeSimpleFromApi {
  id: number;
  descricao: string;
  status: boolean;
}

export interface IProcedureTypeToApi {
  descricao: string;
  status: boolean;
}

export interface IProcedureType {
  id: number | string;
  description: string;
  status: boolean;
  procGroups: Groups[];
}

export interface IProcedureTypeFilteredOption
  extends IProcedureFilteredOption {}

// Procedure Group
export interface Groups {
  id: number;
  descricao: string;
}

export interface IProcedureGroupResponse {
  items: IProcedureGroupFromApi[];
  meta: Meta;
}

export interface IProcedureGroupFilterResponse {
  group: IProcedureGroupFromApi;
  procedures: IProcedureFromApi[];
}

export interface IProcedureTypeGroupRequestParam {
  page: number;
  limit: number;
  typeId?: string;
  descricao?: string;
}

export interface IProcedureTypeGroupRequestFilter {
  page: number;
  limit: number;
  id?: string;
  typeName?: string;
  typeId?: string;
  descricao?: string;
}

export interface IProcedureGroupFromApi {
  id: number;
  descricao: string;
  procedureType?: ProcedureType;
}

export interface IProcedureGroup {
  id: number | string;
  description: string;
  procedureType?: ProcedureType;
}

export interface ProcedureType {
  id: number;
  descricao: string;
  status: boolean;
}

// procedureId=1&patientId=1&professionalId=1&pricingId=1
export interface ITableValues {
  procedureId: number;
  patientId: number;
  professionalId: number;
  pricingId: number;
}

export interface IProcedureGroupFilteredOption
  extends IProcedureFilteredOption {}

export interface IProfessionalSelectedProceduresToAPi
  extends AutocompleteOption {
  specialtyId: string;
}

export interface IExpertiseAreaSimpleFromApi {
  id: number;
  descricao: string;
  ativo: boolean;
  rqe?: string | null;
}

export interface IUnitSimpleFromAPI {
  id: number;
  descricao: string;
  flgCentral?: string;
}
