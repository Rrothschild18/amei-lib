import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Patient } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  baseUrl: string = 'https://amei-homolog.amorsaude.com.br/api/v1';
  patientsRoute = `${this.baseUrl}/pacientes`;
  token: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXN1YXJpbzJAZW1haWwuY29tIiwiZnVsbE5hbWUiOiJOb21lIDIgU29icmVub21lIiwibG9nZ2VkQ2xpbmljIjpudWxsLCJyb2xlIjoidXNlciIsImlhdCI6MTY5MTg2OTg2OCwiZXhwIjoxNjkxODk4NjY4fQ.5_eHCrLenXFKPgalRewqkk8pJZGnbW3E-JWCpFw_C5M';

  constructor(private http: HttpClient) {}

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.patientsRoute}/${id}`, {
      headers: this.getHeader(),
    });
  }

  private getHeader(): HttpHeaders {
    const head = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${this.token}`);
    return head;
  }

  getPatientFields(): Observable<any> {
    return of(<any>{
      cpf: {
        name: 'cpf',
        label: 'CPF',
        type: 'text',
      },
      nome: {
        name: 'nome',
        label: 'Nome',
        type: 'text',
      },
      sobrenome: {
        name: 'sobrenome',
        label: 'Sobrenome',
        type: 'text',
      },
      nomeSocial: {
        name: 'nomeSocial',
        label: 'Nome social',
        type: 'text',
      },
      rg: {
        name: 'rg',
        label: 'RG',
        type: 'text',
      },
      dataNascimento: {
        name: 'dataNascimento',
        label: 'Data nascimento',
        type: 'date',
      },
      nomeMae: {
        name: 'nomeMae',
        label: 'Nome mae',
        type: 'text',
        initialValue: false,
      },
      naturalidade: {
        name: 'naturalidade',
        label: 'Naturalidade',
        type: 'text',
      },
      nacionalidade: {
        name: 'nacionalidade',
        label: 'Nacionalidade',
        type: 'select',
        options: [
          { label: 'Brasileiro(a)', id: 1 },
          { label: 'Estrangeiro(a)', id: 2 },
        ],
      },
      etnia: {
        name: 'etnia',
        label: 'Etnia',
        type: 'select',
        options: [
          {
            label: 'Negra',
            value: 1,
          },
          {
            label: 'Branca',
            value: 2,
          },
          {
            label: 'Parda',
            value: 3,
          },
          {
            label: 'Amarela',
            value: 4,
          },
          {
            label: 'Indígena',
            value: 5,
          },
        ],
      },
      sexo: {
        name: 'sexo',
        label: 'Sexo',
        type: 'select',
        options: [
          {
            label: 'Masculino',
            value: 1,
          },
          {
            label: 'Feminino',
            value: 2,
          },
          {
            label: 'Não definido',
            value: 3,
          },
        ],
      },
      genero: {
        name: 'genero',
        label: 'Genero',
        type: 'select',
        options: [
          {
            label: 'Mulher Cis',
            value: 1,
          },
          {
            label: 'Homem Cis',
            value: 2,
          },
          {
            label: 'Mulher Trans',
            value: 3,
          },
          {
            label: 'Homem Trans',
            value: 4,
          },
          {
            label: 'Travesti',
            value: 5,
          },
          {
            label: 'Não binário',
            value: 6,
          },
          {
            label: 'Agênero',
            value: 7,
          },
          {
            label: 'Gênero Fluido',
            value: 8,
          },
        ],
      },
      cns: {
        name: 'cns',
        label: 'Cartao nacional de Saude',
        type: 'text',
      },
      estadoCivil: {
        name: 'estadoCivil',
        label: 'Estado civil',
        type: 'select',
        options: [
          {
            label: 'Casado (a)',
            value: 1,
          },
          {
            label: 'Divorciado (a)',
            value: 2,
          },
          {
            label: 'Separado (a)',
            value: 3,
          },
          {
            label: 'Solteiro (a)',
            value: 4,
          },
          {
            label: 'União Estável',
            value: 5,
          },
          {
            label: 'Viúvo (a)',
            value: 6,
          },
        ],
      },
      profissao: {
        name: 'profissao',
        label: 'Profissao',
        type: 'text',
      },
      origem: {
        name: 'origem',
        label: 'Origem',
        type: 'select',
        options: [],
      },
      prioridade: {
        name: 'prioridade',
        label: 'Prioridade',
        type: 'select',
        options: [
          {
            label: 'Cardíaco',
            value: 1,
          },
          {
            label: 'Criança de colo',
            value: 2,
          },
          {
            label: 'Lactante',
            value: 3,
          },
          {
            label: 'Portador de deficiência',
            value: 4,
          },
          {
            label: 'Obeso',
            value: 5,
          },
          {
            label: 'Idoso',
            value: 6,
          },
          {
            label: 'Gestante',
            value: 7,
          },
          {
            label: 'Cadeirante',
            value: 8,
          },
          {
            label: 'Outro',
            value: 9,
          },
        ],
      },
      dataCadastro: {
        name: 'dataCadastro',
        label: 'Data cadastro',
        type: 'date',
      },
      restricoesTratamentoMedico: {
        name: 'restricoesTratamentoMedico',
        label: 'Restricoes medicas',
        type: 'textarea',
      },
      obito: {
        name: 'obito',
        label: 'obito',
        type: 'select',
        options: [
          { label: 'Sim', value: 1 },
          { label: 'Nao', value: 0 },
        ],
      },
      //Contact
      email: {
        name: 'email',
        label: 'E-mail',
        type: 'text',
      },
      celular: {
        name: 'celular',
        label: 'Celular',
        type: 'text',
      },
      celularAlternativo: {
        name: 'celularAlternativo',
        label: 'Celular alternativo',
        type: 'text',
      },
      telefone: {
        name: 'telefone',
        label: 'Telefone',
        type: 'text',
      },

      //Address
      cep: {
        name: 'cep',
        label: 'CEP',
        type: 'text',
      },
      endereco: {
        name: 'endereco',
        label: 'Endereco',
        type: 'text',
      },
      numero: {
        name: 'numero',
        label: 'Numero',
        type: 'text',
      },
      complemento: {
        name: 'complemento',
        label: 'Complemento',
        type: 'text',
      },
      bairro: {
        name: 'bairro',
        label: 'Bairro',
        type: 'text',
      },
      cidade: {
        name: 'cidade',
        label: 'Cidade',
        type: 'text',
      },
      estado: {
        name: 'estado',
        label: 'Estado',
        type: 'text',
      },
    });
  }
}
