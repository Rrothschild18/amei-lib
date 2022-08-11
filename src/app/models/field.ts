export class Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  options: { label: string; value: string }[];
  children: {
    [key: string]: Field;
  };

  constructor(
    options: {
      label?: string;
      name?: string;
      key?: string;
      type?: string;
      required?: boolean;
      options?: { label: string; value: string }[];
      children?: { [key: string]: Field };
    } = {}
  ) {
    this.label = options.label || '';
    this.name = options.name || '';
    this.type = options.type || '';
    this.required = !!options.required;
    this.children = {};
    this.options = options.options || [];
  }
}
