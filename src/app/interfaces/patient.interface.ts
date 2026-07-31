import {
  FieldsArrayName,
  FieldsColumnsConfig,
  FieldsValidatorsConfig,
  FieldsAttributesConfig,
  FieldsConfig,
} from '../models';

export interface Patient {
  uuid: string;
  //Dados gerais
  cpf: string;
  nome: string;
  sobrenome: string;
  nomeSocial: string;
  rg: string;
  dataNascimento: Date | string;
  nomeMae: string;
  naturalidade: string;
  nacionalidade: number;
  etnia: number;
  sexo: number;
  genero: number;
  cns: string;
  estadoCivil: number;
  profissao: string;
  origem: number;
  prioridade: number;
  dataCadastro: number;
  restricoesTratamentoMedico: string;
  obito: number;
  //

  //contato
  email: string;
  celular: string;
  celularAlternativo: string;
  telefone: string;

  //Endereco
  cep: string;
  endereco: string;
  numero: number;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: number;

  //Observacoes
  observacoes: string;

  //
  procedures: number[];
}

export type PatientFields = FieldsConfig<Patient>;
//Todo NestedFields

export type PatientGeneral = FieldsArrayName<
  Omit<Patient, keyof PatientContact | keyof PatientAddress>
>;

export type PatientFieldGeneralNames = FieldsArrayName<Patient>;
export type PatientGeneralColumns = FieldsColumnsConfig<Patient>;
export type PatientGeneralValidators = FieldsValidatorsConfig<Patient>;
export type PatientGeneralAttributes = FieldsAttributesConfig<Patient>;
export type PatientGeneralFields = FieldsConfig<Patient>;

export type PatientContact = Pick<
  Patient,
  'email' | 'celular' | 'celularAlternativo' | 'telefone'
>;

export type PatientContactFieldNames = FieldsArrayName<PatientContact>;
export type PatientContactColumns = FieldsColumnsConfig<PatientContact>;
export type PatientContactValidators = FieldsValidatorsConfig<PatientContact>;
export type PatientContactAttributes = FieldsAttributesConfig<PatientContact>;
export type PatientContactFields = FieldsConfig<PatientContact>;

export type PatientAddress = Pick<
  Patient,
  | 'cep'
  | 'endereco'
  | 'numero'
  | 'complemento'
  | 'bairro'
  | 'cidade'
  | 'estado'
  | 'procedures'
>;

export type PatientAddressFieldNames = FieldsArrayName<PatientAddress>;
export type PatientAddressColumns = FieldsColumnsConfig<PatientAddress>;
export type PatientAddressValidators = FieldsValidatorsConfig<PatientAddress>;
export type PatientAddressAttributes = FieldsAttributesConfig<PatientAddress>;
export type PatientAddressFields = FieldsConfig<PatientAddress>;
