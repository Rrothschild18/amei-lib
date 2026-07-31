import { ProfessionalActions } from '../professionals/professional.actions';
import { PatientActions } from './../patients/patient.actions';

interface Entities {
  [key: string]: any;
}

export const Entities: Entities = {
  Patient: { ...PatientActions },
  Professional: { ...ProfessionalActions },
};

// export namespace Entities {
//   export namespace Patient {
//     export class AddPatientFormSubmitted {
//       static readonly type = '[Add Patient] Add Patient Form Submitted';
//       constructor(public payload: { patient: Patient }) {}
//     }

//     export class AddPatientSuccess {
//       static readonly type = '[Patient] Add Patient Success';
//     }

//     export class AddPatientFailed {
//       static readonly type = '[Patient] Add Patient Failed';
//       constructor(public payload: { error: any }) {}
//     }

//     export class EditPatientFormSubmitted {
//       static readonly type = '[Edit Menu Page] Edit Patient Form Submitted';
//       constructor(public payload: { patient: Patient }) {}
//     }

//     export class EditPatientSuccess {
//       static readonly type = '[Patient] Edit Patient Success';
//       constructor(public payload: { patient: Patient }) {}
//     }

//     export class EditPatientFailed {
//       static readonly type = '[Patient] Edit Patient Failed';
//       constructor(public payload: { error: any }) {}
//     }

//     export class DeletePatientInitiated {
//       static readonly type = '[Delete Menu Page] Delete Patient Initiated';
//       constructor(public payload: { patientId: string }) {}
//     }

//     export class DeletePatientSuccess {
//       static readonly type = '[Patient] Delete Patient Success';
//       constructor(public payload: { patientId: string }) {}
//     }

//     export class DeletePatientFailed {
//       static readonly type = '[Patient] Delete Patient Failed';
//       constructor(public payload: { error: any }) {}
//     }
//   }
// }
