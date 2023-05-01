import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  IFinancialAccountsForReceipt,
  IFinancialAccountsForReceiptRequestParam,
  IFinancialAccountsType,
  IFormsOfSettlementFromApi,
  IFormsOfSettlementParam,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class FinancialAccountsService {
  baseUrl: string = 'https://amei-dev.amorsaude.com.br/api/v1';
  token: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIxLCJlbWFpbCI6InVzdWFyaW8yQGVtYWlsLmNvbSIsImZ1bGxOYW1lIjoiVVNVQVJJTyAyIiwibG9nZ2VkQ2xpbmljIjpudWxsLCJyb2xlIjoidXNlciIsImlhdCI6MTY4Mjk1ODkzMCwiZXhwIjoxNjgyOTg3NzMwfQ.2S7P6yMbW0qSM1c9TwxqmkaNP7lpwwSPa9cEQKhZo2s';

  private currentAccountsTypes = `${this.baseUrl}/current-accounts-related/types`;
  private currentAccountsAccountsForReceipt = `${this.baseUrl}/current-accounts-related/accounts-for-receipt`;
  private currentAccountsFormsOfSettlement = `${this.baseUrl}/current-accounts-related/forms-of-settlement`;

  constructor(private http: HttpClient) {}

  private getHeader(): HttpHeaders {
    const head = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${this.token}`);
    return head;
  }

  getFields(): Observable<any> {
    return of({
      unidadeId: {
        name: 'unidadeId',
        label: 'Unidade',
        type: 'select',
        options: [],
      },
      tipoContaId: {
        name: 'tipoContaId',
        label: 'Tipo de conta',
        type: 'select',
        options: [],
      },
      modalidadeId: {
        name: 'modalidadeId',
        label: 'Modalidade',
        type: 'select',
        options: [],
      },
      bancoId: {
        name: 'bancoId',
        label: 'Banco',
        type: 'select',
        options: [],
      },
      nome: {
        name: 'nome',
        label: 'Sobrenome',
        type: 'text',
      },
      contaRecebimentoId: {
        name: 'contaRecebimentoId',
        label: 'Conta para recebimento',
        type: 'select',
        options: [],
      },
      flagTef: {
        name: 'flagTef',
        label: 'TEF',
        type: 'checkbox',
      },
      flagSplit: {
        name: 'flagSplit',
        label: 'SPLIT',
        type: 'checkbox',
      },
      agencia: {
        name: 'agencia',
        label: 'Agência',
        type: 'text',
      },
      numero: {
        name: 'numero',
        label: 'Número da conta (NUMER0)',
        type: 'text',
      },
      titulo: {
        name: 'titulo',
        label: 'Titular',
        type: 'text',
      },
      documento: {
        name: 'documento',
        label: 'Documento',
        type: 'text',
      },
      diaVencimento: {
        name: 'diaVencimento',
        label: 'Dia do vencimento (numero)',
        type: 'text',
      },
      melhorDiaCompra: {
        name: 'melhorDiaCompra',
        label: 'Melhor dia para compra (numero)',
        type: 'text',
      },
      diasCreditoConta: {
        name: 'diasCreditoConta',
        label: 'Dias para crédito (numero)',
        type: 'text',
      },
      contaLiquidacao: {
        name: 'contaLiquidacao',
        label: 'Formas de recebimento (multiple)',
        type: 'select',
        options: [],
      },
      nomeBanco: {
        name: 'nomeBanco',
        label: 'Address',
        type: 'text',
      },
    });
  }

  getCurrentClinic() {
    return of({ label: 'Telemedicina', value: '100' });
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
    filters: IFormsOfSettlementParam
  ): Observable<IFormsOfSettlementFromApi[]> {
    return this.http.get<IFormsOfSettlementFromApi[]>(
      this.currentAccountsFormsOfSettlement,
      {
        headers: this.getHeader(),
        params: <HttpParams>(<unknown>filters),
      }
    );
  }
}
