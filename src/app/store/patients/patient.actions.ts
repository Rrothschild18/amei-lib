import { FieldsConfig } from './../../models/form';
import { EntityPayload } from '../entities/entities.model';
import { Patient, PatientApiSuccessResponse } from './patient.model';

export const PatientActions = {
  /** Start of Form Actions  */
  CreateEntity: class CreateEntity {
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

  /* This actions might return only Fields at CreateMode **/
  FetchEntityFieldsForCreateMode: class FetchEntityFieldsForCreateMode {
    static readonly type = '[Patient Form Create] Fetch Patients Fields';
  },

  FetchEntityFieldsSuccess: class FetchEntityFieldsSuccess {
    static readonly type =
      '[Patients Form Create] Fetch Patient Fields Success';
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
    static readonly type = '[Patient Loading] Patients isLoading True ';
  },

  SetLoadingFalse: class SetLoadingFalse {
    static readonly type = '[Patient Loading] Patients isLoading False ';
  },

  FetchEntityById: class FetchEntityById {
    static readonly type = '[Patient] Fetch Patient by Id';
    constructor(public payload: string) {}
  },

  FetchEntityByIdSuccess: class FetchEntityByIdSuccess {
    static readonly type = '[Patient Create] Get Patient by Id Success';
    constructor(public payload: EntityPayload) {}
  },

  FetchPatientByIdError: class FetchPatientByIdError {
    static readonly type = '[Patient] Fetch Patient by Id Error';
  },

  /** Patch patient */
  PatchEntity: class PatchPatient {
    static readonly type = '[Patient] Patch Patient';
    constructor(
      public payload: { entityPayload: EntityPayload; entityId: string }
    ) {}
  },

  PatchPatientSuccess: class PatchPatientSuccess {
    static readonly type = '[Patient] Patch Patient Success';
    constructor(public payload: EntityPayload) {}
  },

  PatchPatientError: class PatchPatientError {
    static readonly type = '[Patient] Patch Patient Error';
  },

  /** End of Form Actions  */

  FetchAllEntities: class FetchAllEntities {
    static readonly type = '[Patient List] Fetch All Entities';
  },

  FetchAllEntitiesSuccess: class FetchAllEntitiesSuccess {
    static readonly type = '[Patient List] Fetch All Entities Success';
    constructor(public payload: EntityPayload) {}
  },

  FetchAllEntitiesError: class FetchAllEntitiesError {
    static readonly type = '[Patient List] Fetch All Entities Error';
    constructor() {}
  },
};
