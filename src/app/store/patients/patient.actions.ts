import { FieldsConfig } from './../../models/form';
import { EntityPayload } from '../entities/entities.model';
import { Patient, PatientApiSuccessResponse } from './patient.model';

export const PatientActions = {
  CreateEntity: class AddPatient {
    static readonly type = '[Patient] Add Patient';
    constructor(public payload: Patient) {}
  },

  AddPatientSuccess: class AddPatientSuccess {
    static readonly type = '[Patient] Add Patient Success';
    constructor(public payload: PatientApiSuccessResponse) {}
  },

  AddPatientFailed: class AddPatientFailed {
    static readonly type = '[Patient] Add Patient Failed';
    constructor(public payload: { error: any }) {}
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

  PatchPatientFields: class PatchPatientFields {
    static readonly type = '[Patients Fields] Patients Fields Patched ';
    constructor(public payload: { fields: FieldsConfig<Patient> }) {}
  },

  SetLoadingTrue: class SetLoadingTrue {
    static readonly type = '[Patients Loading] Patients isLoading True ';
  },

  SetLoadingFalse: class SetLoadingFalse {
    static readonly type = '[Patients Loading] Patients isLoading False ';
  },

  FetchPatientById: class FetchPatientById {
    static readonly type = '[Patient] Fetch Patient by Id';
    constructor(public payload: string) {}
  },

  FetchPatientByIdSuccess: class FetchPatientByIdSuccess {
    static readonly type = '[Patient] Fetch Patient by Id Success';
    constructor(public payload: EntityPayload) {}
  },

  FetchPatientByIdError: class FetchPatientByIdError {
    static readonly type = '[Patient] Fetch Patient by Id Error';
  },
};
