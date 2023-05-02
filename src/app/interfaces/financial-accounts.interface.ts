import { FieldsAttributesConfig, FieldsConfig } from './../models/form';
import {
  FieldsArrayName,
  FieldsColumnsConfig,
  FieldsValidatorsConfig,
} from '../models';
import { SortDirection } from '@angular/material/sort';
import { HttpHeaders, HttpContext, HttpParams } from '@angular/common/http';

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

export enum ETextAccountReceiveForms {
  EMPTY = '',
  DINHEIRO = 'Dinheiro',
  PIX = 'PIX',
  CARTAO_DEBITO = 'Cartão de Débito',
  CARTAO_CREDITO = 'Cartão de Crédito',
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

export enum ENumberAccountReceiveForms {
  DINHEIRO = 1,
  PIX = 2,
  CARTAO_DEBITO = 7,
  CARTAO_CREDITO = 8,
}

export enum EFormsOfSettlementOperationType {
  RECEITAS = 1,
  DESPESAS = 2,
}

export type FinancialAccountFieldNames = FieldsArrayName<FinancialAccount>;

export type FinancialAccountColumns = FieldsColumnsConfig<FinancialAccount>;

export type FinancialAccountValidators =
  FieldsValidatorsConfig<FinancialAccount>;

export type FinancialAccountAttributes =
  FieldsAttributesConfig<FinancialAccount>;

export type FinancialAccountFields = FieldsConfig<FinancialAccount>;
