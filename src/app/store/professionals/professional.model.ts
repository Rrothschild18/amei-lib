import { EntityFields } from '../entities/entities.model';

export interface Professional {
  name: string;
  lastname: string;
  email: string;
  document: string;
  specialty: string;
  availability: string;
}

export interface ProfessionalStateModel {
  professional: Professional[];
  fields: EntityFields;
}
