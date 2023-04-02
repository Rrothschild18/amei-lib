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
        options: [
          {
            label: 'Dota 2',
            value: '560e8a3f-1176-4f78-8fe7-174ab9fe8aa1',
          },
          {
            label: 'League of Legends',
            value: 'd6749294-14ce-413c-a180-e78b33285ec6',
          },
          {
            label: 'Rust',
            value: '9371c545-ceb4-4215-90d6-9cd1316e2bbd',
          },
          {
            label: 'Warcraft',
            value: 'eb169d5f-40c1-4176-8b9e-d6b3a385b807',
          },
          {
            label: 'Warzone',
            value: '631185e0-fa25-4d6c-ac98-701bda2f772b',
          },
        ],
      },
      country: {
        name: 'country',
        label: 'Countries',
        type: 'select',
        options: [
          {
            label: 'Brazil',
            value: 'f0d0a6fb-ee32-4039-a358-e84695ca80b8',
          },
          {
            label: 'Ireland',
            value: 'ca36dad1-1e14-426c-b965-72072eef9487',
          },
          {
            label: 'Australia',
            value: '303c7046-5db6-498d-9d1d-0d501b1a1f2e',
          },
          {
            label: 'Canada',
            value: '093c9a2e-8c84-4fe7-8caa-08301a143712',
          },
          {
            label: 'Portugal',
            value: 'f9c83357-addc-4d36-ae31-2d09aed15a54',
          },
        ],
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
