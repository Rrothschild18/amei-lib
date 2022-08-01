import { EntityFields } from '../entities/entities.model';

export interface Patient {
  name: string;
  lastname: string;
  phone: string;
  email: string;
  document: string;
  gender: string;
  uuid: string;
}

export interface PatientStateModel {
  patients: Patient[];
  fields: EntityFields; //Entity fields type of Pacient
}
