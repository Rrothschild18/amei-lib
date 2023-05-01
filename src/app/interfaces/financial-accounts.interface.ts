import { FieldsAttributesConfig, FieldsConfig } from './../models/form';
import {
  FieldsArrayName,
  FieldsColumnsConfig,
  FieldsValidatorsConfig,
} from '../models';

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
