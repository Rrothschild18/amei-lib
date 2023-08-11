import { FieldsAttributesConfig, FieldsConfig } from './../models/form';
import {
  FieldsArrayName,
  FieldsColumnsConfig,
  FieldsValidatorsConfig,
} from '../models';
import { SortDirection } from '@angular/material/sort';
import { HttpHeaders, HttpContext, HttpParams } from '@angular/common/http';
export interface IFinancialAccountRequestParam {
  page: number;
  limit: number;
  id?: number;
  nome?: string;
  tipoContaId?: number;
  tipoConta?: string;
  modalidadeId?: number;
  modalidade?: string;
  bandeira?: string;
  unidadeId?: number;
  unidade?: string;
  flagTef?: boolean;
  flagSplit?: boolean;
  sortBy?: string;
  sortDirection?: string;
}

export interface IFinancialAccountFilterParam {
  page?: number;
  limit?: number;
  name?: string;
  financialAccountTypeId?: number;
  modalityId?: number;
  bankId?: number;
  active?: boolean;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface FinancialAccountResponse {
  items: IFinancialAccountFromApi[];
  meta: any;
}
export interface IFinancialAccountFromApi {
  id: number;
  nome: string;
  tipoContaId: number;
  tipoConta: string;
  unidadeId: number;
  unidade: string;
  contaLiquidacao: IFormsOfSettlementFromApi[];
  bancoId: number | null;
  banco: string | null;
  agencia: string | null;
  numero: string | null;
  titulo: string | null;
  documento: string | null;
  modalidadeId: number | null;
  modalidade: string | null;
  contaRecebimentoId: number | null;
  contaRecebimento: string | null;
  bandeiraId: number | null;
  bandeira: string | null;
  descontoPercentual: number | null;
  diaVencimento: number | null;
  diasCreditoConta: number | null;
  flagSplit: string | null;
  flagTef: string | null;
  melhorDiaCompra: number | null;
  // funcionario: IEmployeeFromApi[] | null;
  funcionario: IFinancialAccountEmployeesFromApi[] | null;
}

export interface IFinancialAccountEmployeesFromApi {
  id: number;
  contaCorrenteId: number;
  funcionarioId: number;
  nome: string;
  cpf: string | null;
  funcao: string | null;
  setorId: number | null;
  setor: string | null;
  selecionado: boolean;
}
export interface IFormsOfSettlementFromApi {
  id: number;
  formaLiquidacao: ETextAccountReceiveForms;
  formaLiquidacaoId: number;
  tipoOperacaoId: EFormsOfSettlementOperationType;
  tipoOperacao: string;
}
export interface FinancialAccountResponse {
  items: IFinancialAccountFromApi[];
  meta: any;
}

export interface IFinancialAccountsType {
  id: number;
  tipoContaCorrente: string;
  flagAtivo: string;
}

export type FinancialAccount = {
  unidadeId: string | number;
  tipoContaId: string | number;
  modalidadeId: string | number;
  bancoId: string | number;
  nome: string | number;
  contaRecebimentoId: number | string;
  flagTef: boolean;
  flagSplit: boolean;
  agencia: string;
  numero: string | number;
  titulo: string;
  documento: string;
  diaVencimento: number | string;
  melhorDiaCompra: number | string;
  diasCreditoConta: number | string;
  contaLiquidacao: string | number;
  nomeBanco: string;
};

export interface IFinancialAccountsForReceiptRequestParam {
  id?: number;
  name?: string;
  unidadeId?: number;
  tipoContaId?: number;
}

export interface IFinancialAccountsForReceipt {
  id: number;
  nome: string;
  unidadeId: number;
  unidade: string;
  tipoContaId: number;
  tipoConta: string;
  bancoId: number;
  banco: string;
  agencia: string;
  numero: string;
}

export interface IFormsOfSettlementParam {
  tipoOperacaoId?: number;
}
export interface IFormsOfSettlementFromApi {
  id: number;
  formaLiquidacao: ETextAccountReceiveForms;
  tipoOperacaoId: EFormsOfSettlementOperationType;
  tipoOperacao: string;
}

// Banks

export interface IBankRequestParam {
  name?: string;
  unityId?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface IBankFilterRequestParam {
  page: number;
  limit: number;
  name?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface IBankFilterParam {
  page?: number;
  limit?: number;
  bankName?: string;
  bankCode?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface BankResponse {
  items: IBankFromApi[];
  meta: any;
}

export interface IBankFromApi {
  id: number;
  codigoBanco: string;
  nomeBanco: string;
  flgAtivo: string;
}

export interface IBankToApi {
  bankCode: string;
  bankName: string;
}

export interface IBankCreateResponse {
  flagDeError: boolean;
  codigo: number;
  mensagem: string;
  id: number;
}

export interface IFinancialAccountsModality {
  id: number;
  modalidade: string;
  flagAtivo: string;
}

export interface httpGetOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

export enum ETextAccountReceiveForms {
  EMPTY = '',
  DINHEIRO = 'Dinheiro',
  PIX = 'PIX',
  CARTAO_DEBITO = 'Cartão de Débito',
  CARTAO_CREDITO = 'Cartão de Crédito',
}

export enum ENumberAccountReceiveForms {
  DINHEIRO = '1',
  PIX = '2',
  CARTAO_DEBITO = '7',
  CARTAO_CREDITO = '8',
}

export enum EFormsOfSettlementOperationType {
  RECEITAS = 1,
  DESPESAS = 2,
}

export enum EFinancialAccountType {
  CAIXA_FISICO = '1',
  CONTA_BANCARIA = '2',
  CARTAO = '3',
}

export enum EFinancialAccountModality {
  CC_RECEBIMENTO = '1',
  CC_PAGAMENTO = '2',
  CD_RECEBIMENTO = '3',
}
export type FinancialAccountFieldNames = FieldsArrayName<FinancialAccount>;

export type FinancialAccountColumns = FieldsColumnsConfig<FinancialAccount>;

export type FinancialAccountValidators =
  FieldsValidatorsConfig<FinancialAccount>;

export type FinancialAccountAttributes =
  FieldsAttributesConfig<FinancialAccount>;

export type FinancialAccountFields = FieldsConfig<FinancialAccount>;
