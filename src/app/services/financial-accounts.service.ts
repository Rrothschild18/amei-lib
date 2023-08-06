import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  BankResponse,
  FinancialAccountFields,
  FinancialAccountResponse,
  IBankFilterRequestParam,
  IBankFromApi,
  IBankRequestParam,
  IFinancialAccountFromApi,
  IFinancialAccountRequestParam,
  IFinancialAccountsForReceipt,
  IFinancialAccountsForReceiptRequestParam,
  IFinancialAccountsModality,
  IFinancialAccountsType,
  IFormsOfSettlementFromApi,
  IFormsOfSettlementParam,
  httpGetOptions,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class FinancialAccountsService {
  baseUrl: string = 'https://amei-homolog.amorsaude.com.br/api/v1';
  token: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXN1YXJpbzJAZW1haWwuY29tIiwiZnVsbE5hbWUiOiJOb21lIDIgU29icmVub21lIiwibG9nZ2VkQ2xpbmljIjpudWxsLCJyb2xlIjoidXNlciIsImlhdCI6MTY5MTMzNDE2MywiZXhwIjoxNjkxMzYyOTYzfQ.JIVaAmOLkMThBXV3CRSbgpJcosG8PlrKb2EKFqpsbtM';

  private currentAccountsTypes = `${this.baseUrl}/current-accounts-related/types`;
  private currentAccountsAccountsForReceipt = `${this.baseUrl}/current-accounts-related/accounts-for-receipt`;
  private currentAccountsFormsOfSettlement = `${this.baseUrl}/current-accounts-related/forms-of-settlement`;
  private currentAccountsBanksFilter = `${this.baseUrl}/contas-correntes/bancos/filtro`;
  private currentAccountsBanks = `${this.baseUrl}/contas-correntes/bancos`;
  private currentAccountsModalities = `${this.baseUrl}/current-accounts-related/modalities`;
  private currentAccountRoute = `${this.baseUrl}/current-accounts`;

  constructor(private http: HttpClient) {}

  private getHeader(): HttpHeaders {
    const head = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${this.token}`);
    return head;
  }

  getFields(): Observable<FinancialAccountFields> {
    return of(<FinancialAccountFields>{
      unidadeId: {
        name: 'unidadeId',
        label: 'Unidade',
        type: 'select',
        initialValue: null,
        options: [],
      },
      tipoContaId: {
        name: 'tipoContaId',
        label: 'Tipo de conta',
        type: 'select',
        initialValue: null,
        options: [],
      },
      modalidadeId: {
        name: 'modalidadeId',
        label: 'Modalidade',
        type: 'select',
        initialValue: [],
        options: [],
      },
      bancoId: {
        name: 'bancoId',
        label: 'Banco',
        type: 'select',
        initialValue: [],
        options: [],
      },
      nome: {
        name: 'nome',
        label: 'Nome de Identificação',
        type: 'text',
        initialValue: '',
      },
      contaRecebimentoId: {
        name: 'contaRecebimentoId',
        label: 'Conta para recebimento',
        type: 'select',
        initialValue: [],
        options: [],
      },
      flagTef: {
        name: 'flagTef',
        label: 'TEF',
        type: 'checkbox',
        initialValue: false,
      },
      flagSplit: {
        name: 'flagSplit',
        label: 'SPLIT',
        type: 'checkbox',
        initialValue: false,
      },
      agencia: {
        name: 'agencia',
        label: 'Agência',
        type: 'text',
        initialValue: '',
      },
      numero: {
        name: 'numero',
        label: 'Número da conta (NUMER0)',
        type: 'text',
        initialValue: '',
      },
      titulo: {
        name: 'titulo',
        label: 'Titular',
        type: 'text',
        initialValue: '',
      },
      documento: {
        name: 'documento',
        label: 'Documento',
        type: 'text',
        initialValue: '',
      },
      diaVencimento: {
        name: 'diaVencimento',
        label: 'Dia do vencimento (numero)',
        type: 'text',
        initialValue: '',
      },
      melhorDiaCompra: {
        name: 'melhorDiaCompra',
        label: 'Melhor dia para compra (numero)',
        type: 'text',
        initialValue: '',
      },
      diasCreditoConta: {
        name: 'diasCreditoConta',
        label: 'Dias para crédito (numero)',
        type: 'text',
        initialValue: '',
      },
      contaLiquidacao: {
        name: 'contaLiquidacao',
        label: 'Formas de recebimento (multiple)',
        type: 'select',
        initialValue: [],
        options: [],
      },
    });
  }

  getCurrentClinic() {
    return of([{ label: 'Telemedicina', value: 183 }]);
  }

  getCurrentAccountsRelatedTypes(): Observable<IFinancialAccountsType[]> {
    return this.http.get<IFinancialAccountsType[]>(this.currentAccountsTypes, {
      headers: this.getHeader(),
    });
  }

  listAccountsForReceipt(
    filters: IFinancialAccountsForReceiptRequestParam
  ): Observable<IFinancialAccountsForReceipt[]> {
    return this.http.get<IFinancialAccountsForReceipt[]>(
      this.currentAccountsAccountsForReceipt,
      {
        headers: this.getHeader(),
        params: <HttpParams>(<unknown>filters),
      }
    );
  }

  listFormsOfSettlement(
    filters?: IFormsOfSettlementParam
  ): Observable<IFormsOfSettlementFromApi[]> {
    return this.http.get<IFormsOfSettlementFromApi[]>(
      this.currentAccountsFormsOfSettlement,
      {
        headers: this.getHeader(),
        params: <HttpParams>(<unknown>filters),
      }
    );
  }

  listBanksWithFilters(
    filters: IBankFilterRequestParam
  ): Observable<BankResponse> {
    return this.http.get<BankResponse>(`${this.currentAccountsBanksFilter}/`, {
      headers: this.getHeader(),
      params: <HttpParams>(<unknown>filters),
    });
  }

  listBanks(filters?: IBankRequestParam): Observable<IBankFromApi[]> {
    let options: httpGetOptions = {
      headers: this.getHeader(),
    };

    if (filters)
      options = {
        ...options,
        params: <HttpParams>(<unknown>filters),
      };

    return this.http.get<IBankFromApi[]>(this.currentAccountsBanks, options);
  }

  listModalities(): Observable<IFinancialAccountsModality[]> {
    return this.http.get<IFinancialAccountsModality[]>(
      this.currentAccountsModalities,
      {
        headers: this.getHeader(),
      }
    );
  }

  listFinancialAccountsWithFilters(
    filters: IFinancialAccountRequestParam
  ): Observable<FinancialAccountResponse> {
    return this.http.get<FinancialAccountResponse>(
      `${this.currentAccountRoute}`,
      {
        headers: this.getHeader(),
        params: <HttpParams>(<unknown>filters),
      }
    );
  }

  getFinancialAccountById(id: number): Observable<IFinancialAccountFromApi> {
    return this.http.get<IFinancialAccountFromApi>(
      `${this.currentAccountRoute}/${id}`,
      {
        headers: this.getHeader(),
      }
    );
  }
}
