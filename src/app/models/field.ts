export class Field {
  name: string;
  label: string;
  type: FieldTypes;
  placeholder?: string;
  options: { label: string; value: string }[];
  loadingStatus: boolean;
  children: {
    [key: string]: Field;
  };

  constructor(
    options: {
      label?: string;
      name?: string;
      key?: string;
      type?: FieldTypes;
      options?: { label: string; value: string }[];
      children?: { [key: string]: Field };
    } = {}
  ) {
    this.label = options.label || '';
    this.name = options.name || '';
    this.type = options.type || 'text';
    this.loadingStatus = false;
    this.children = {};
    this.options = options.options || [];
  }
}

export type FieldTypes =
  | 'text'
  | 'select'
  | 'textarea'
  | 'date'
  | 'radio'
  | 'email'
  | 'checkbox';
