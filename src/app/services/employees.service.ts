import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../interfaces';
import { FieldsConfig } from '../models';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  constructor() {}

  getFields(): Observable<any> {
    return of({
      uuid: {
        name: 'uuid',
        label: 'uuid',
        type: 'text',
      },
      isActive: {
        name: 'isActive',
        label: 'Is active?',
        type: 'radio',
        options: [
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
        ],
      },
      name: {
        name: 'name',
        label: 'Nome',
        type: 'text',
      },
      lastName: {
        name: 'lastName',
        label: 'Sobrenome',
        type: 'text',
      },
      civilStatus: {
        name: 'civilStatus',
        label: 'Civil status',
        type: 'select',
        options: [
          {
            label: 'Solteiro',
            value: 'cb884f43-9a36-4fd8-8a35-f38c798dc5d4',
          },
          {
            label: 'Casado',
            value: '927a5852-b3fb-45b8-89cd-c5e1f9e2ee90',
          },
          {
            label: 'Divorciado (a)',
            value: 'c35b34a6-12b1-42a2-9106-3a4cdd8d8d8b',
          },
          {
            label: 'Viuvo (a)',
            value: '938a4b72-1a41-4137-9add-2c9611ea1258',
          },
        ],
      },
      document: {
        name: 'document',
        label: 'Document',
        type: 'textarea',
      },
      birthDate: {
        name: 'birthDate',
        label: 'Data de nascimento',
        type: 'date',
      },
      phone: {
        name: 'phone',
        label: 'Phone',
        type: 'text',
      },
      email: {
        name: 'email',
        label: 'E-mail',
        type: 'email',
      },
      games: {
        name: 'games',
        label: 'games',
        type: 'select',
        options: [],
      },
      country: {
        name: 'country',
        label: 'Countries',
        type: 'select',
        options: [],
      },
      cep: {
        name: 'cep',
        label: 'CEP',
        type: 'text',
      },
      state: {
        name: 'state',
        label: 'State',
        type: 'text',
      },
      city: {
        name: 'city',
        label: 'City',
        type: 'text',
      },
      neighborhood: {
        name: 'neighborhood',
        label: 'Neighborhood',
        type: 'text',
      },
      address: {
        name: 'address',
        label: 'Address',
        type: 'text',
      },
      streetNumber: {
        name: 'streetNumber',
        label: 'Street number',
        type: 'text',
      },
      complement: {
        name: 'complement',
        label: 'Complement',
        type: 'text',
      },
    });
  }
}
