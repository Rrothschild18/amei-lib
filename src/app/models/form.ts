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

// export type FieldsAttributesConfig<T extends {}> = {
//   [key in keyof T]: T[key] extends { type: infer U } ? U extends 'hello' ? 'hello' : never : never;
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
  [key in keyof T]?: FieldConfig<T>;
};

export type FieldConfig<T> = {
  name: keyof T;
  label: string;
  type: FieldTypes;
  placeholder?: string;
} & FieldWithSelectOptions<T>;

// working one if has typeText

type FieldWithSelectOptions<T> = T extends { type: 'select' }
  ? {
      options: { label: string; value: string | number }[];
    }
  : {
      options?: { label: string; value: string | number }[];
    };
// export type FieldConfig<T> =
//   | {
//       name: keyof T;
//       label: string;
//       type: Exclude<FieldTypes, 'select'>;
//       placeholder?: string;
//       options: z
//     }
//   | ({
//       name: keyof T;
//       label: string;
//       type: 'select';
//       placeholder?: string;
//     } & {
//       options: { label: string; value: string | number }[];
//     });

export interface FormFieldContext {
  field: Field;
  formGroupRef: FormGroup;
  formControlRef: FormControl | null;
}
