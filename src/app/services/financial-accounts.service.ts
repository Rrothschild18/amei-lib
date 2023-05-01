import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IFinancialAccountsType } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class FinancialAccountsService {
  baseUrl: string = 'https://amei-dev.amorsaude.com.br/api/v1';

  private currentAccountsTypes = `${this.baseUrl}/current-accounts-related/types`;

  constructor(private http: HttpClient) {}

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
      },
      nomeBanco: {
        name: 'nomeBanco',
        label: 'Address',
        type: 'text',
      },
    });
  }

  getCurrentClinic() {
    return of({ label: 'Telemedicina', value: 100 });
  }

  getCurrentAccountsRelatedTypes(): Observable<IFinancialAccountsType[]> {
    return this.http.get<IFinancialAccountsType[]>(this.currentAccountsTypes);
  }
}
