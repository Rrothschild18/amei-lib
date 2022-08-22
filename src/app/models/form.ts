import { ValidatorFn } from '@angular/forms';

export interface FieldsValidatorsConfig {
  [key: string]: ValidatorFn[];
}

export interface FieldsColumnsConfig {
  [key: string]: FieldColumnConfigTypes;
}

export type FieldColumnConfigTypes = {
  [key in ColumTypes]?: string | number;
};

export type ColumTypes = 'col' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
