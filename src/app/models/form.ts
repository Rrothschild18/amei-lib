import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import {
  Field,
  FieldAttrs,
  FieldTypes,
  IBasicInputAttributes,
  ISelectAttributes,
  ITextareaAttributes,
} from './field';

export type FieldsAttributesConfig<T extends {} = any> = {
  [key in keyof T]?: FieldAttrs;
};

// export type FieldsAttributesConfig<T extends {} = any> = {
//   [K in keyof T]?: T[K] extends { type: infer Type }
//     ? Type extends 'select'
//       ? ISelectAttributes
//       : IBasicInputAttributes
//     : IBasicInputAttributes;
// };

// export type FieldsAttributesConfig<T extends {} = any> = {
//   [K in keyof T]?: T[K] extends { type: infer Type }
//     ? Type extends 'select'
//       ? ISelectAttributes
//       : Type extends 'textarea'
//       ? ITextareaAttributes
//       : Type extends 'text'
//       ? IBasicInputAttributes
//       : never
//     : never;
// };

export type FieldsValidatorsConfig<T extends {} = any> = {
  [key in keyof T]?: ValidatorFn[];
};

export type FieldsColumnsConfig<T extends {} = any> = {
  [key in keyof T]?: FieldColumnConfigTypes;
};

export type FieldColumnConfigTypes = {
  [key in ColumTypes]?: string | number;
};

export type ColumTypes = 'col' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;

export type FieldsArrayName<T extends {}> = Array<keyof T>;

export type FieldsConfig<T extends {} = any> = {
  [key in keyof T]?: FieldConfig<T, key>;
};

export interface FieldConfig<T, FieldConfigKey extends keyof T> {
  name: keyof Pick<T, FieldConfigKey>;
  label: string;
  type: FieldTypes;
  placeholder?: string;
  options?: { label: string; value: string }[];
}
export interface FormFieldContext {
  field: Field;
  formGroupRef: FormGroup;
  formControlRef: FormControl | null;
}
