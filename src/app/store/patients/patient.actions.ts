import { EntityPayload } from '../entities/entities.model';

export const PatientActions = {
  AddPatientSuccess: class AddPatientSuccess {
    static readonly type = '[Patient] Add Patient Success';
  },

  FetchAllEntities: class FetchAllEntities {
    static readonly type = '[Patient List] Fetch All Patients';
  },

  FetchAllPatientsSuccess: class FetchAllPatientsSuccess {
    static readonly type = '[Patients List] Patients List Fetch Success';
    constructor(public payload: EntityPayload) {}
  },

  FetchAllPatientsFailed: class FetchAllPatientsFailed {
    static readonly type = '[Patients List] Patients List Fetch Failed';
    constructor(public payload: { error: any }) {}
  },
};
