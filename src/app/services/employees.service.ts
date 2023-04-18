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
      users: {
        name: 'users',
        label: 'Users',
        type: 'autocomplete',
        options: [
          { value: 'a6b9e9e9-43f8-4ec1-9d77-10dbbbed3a02', label: 'John' },
          { value: '9d6a8f70-1e6c-4f23-942d-8e6b06aeb92c', label: 'Jane' },
          { value: '0aaabca2-ffdd-433d-bda6-20c70aaefcb9', label: 'David' },
          { value: 'e16e0685-5af5-488d-b057-139c1ca9f817', label: 'Emily' },
          { value: '1a144cdd-2f3e-4d19-bd43-f831e54d32ba', label: 'Michael' },
          { value: 'f75ddca1-c74c-4d11-93ec-9b36604f9e26', label: 'Olivia' },
          { value: 'c1a16a85-b65c-4157-9ba9-9c3b99cf2a2c', label: 'Sophia' },
          { value: 'fe80f5dd-9739-40ab-9e96-0075d6a787a6', label: 'Daniel' },
          { value: 'ed1ba067-cfcc-4d72-b6ce-ae7e33f0b756', label: 'Isabella' },
          { value: 'e7421ed7-60f6-4a11-86e5-b6d228f61fb1', label: 'Lucas' },
        ],
      },
    });
  }
}
