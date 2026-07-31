import { EntityPayload } from '../entities/entities.model';

export const ProfessionalActions = {
  AddProfessionalSuccess: class AddProfessionalSuccess {
    static readonly type = '[Professional] Add Professional Success';
  },

  FetchAllEntities: class FetchAllEntities {
    static readonly type = '[Professional List] Fetch All Professionals';
  },

  FetchAllProfessionalSuccess: class FetchAllProfessionalsSuccess {
    static readonly type = '[Professional List] Patients List Fetch Success';
    constructor(public payload: EntityPayload) {}
  },

  FetchAllProfessionalFailed: class FetchAllProfessionalsFailed {
    static readonly type =
      '[Professional List] Professionals List Fetch Failed';
    constructor(public payload: { error: any }) {}
  },
};
