import { EntityFields } from '../entities/entities.model';

export interface Patient {
  uuid: string;
  isActive: boolean;
  name: string;
  lastName: string;
  civilStatus: string;
  document: string;
  birthDate: Date;
  phone: string;
  email: string;
  cep: string;
  address: string;
  neighborhood: string;
  streetNumber: number;
  complement: string;
  city: string;
  state: string;
  games: string;
}

export interface PatientApiSuccessResponse extends Patient {
  uuid: string;
  status?: string;
}

export interface PatientStateModel {
  filters: { [key: string]: any };
  results: Patient[];
  fields: EntityFields; //Entity fields type of Pacient
  isLoading: boolean;
}
