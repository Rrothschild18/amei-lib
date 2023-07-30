import { Field } from 'src/app/models/field';

export interface EntityPayload {
  results: EntityResults;
  fields: EntityFields;
}

export interface EntityFields {
  [key: string]: Field;
}

export type EntityResults = { [key: string]: any }[]; //Entity Result type of
