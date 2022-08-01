import { Field } from 'src/app/models/field';

export interface EntityPayload {
  results: EntityResults;
  fields: EntityFields;
}

export interface EntityFields {
  [key: string]: Field;
}

export interface EntityResults {
  [index: number]: { [key: string]: any }; //Entity Result type of
}
