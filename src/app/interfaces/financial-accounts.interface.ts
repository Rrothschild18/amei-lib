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

export type FinancialAccountFieldNames = FieldsArrayName<FinancialAccount>;

export type FinancialAccountColumns = FieldsColumnsConfig<FinancialAccount>;

export type FinancialAccountValidators =
  FieldsValidatorsConfig<FinancialAccount>;

export type FinancialAccountAttributes =
  FieldsAttributesConfig<FinancialAccount>;

export type FinancialAccountFields = FieldsConfig<FinancialAccount>;
