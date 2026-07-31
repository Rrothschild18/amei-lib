import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterObject',
})
export class FilterObjectPipe implements PipeTransform {
  transform<T>(
    fields: { [key: string]: T } | null,
    models: string[] | null
  ): { [key: string]: T } {
    if (fields === null) {
      return {}; // Return the entire object if models are null or empty
    }

    if (models === null || !models.length) {
      return fields; // Return the entire object if models are null or empty
    }

    if (!models) {
      throw new Error('Please provide an array of model');
    }

    if (!fields || !Object.keys(fields).length) {
      return {};
    }

    const object: { [key: string]: T } = {};

    models.forEach((model: string) => {
      if (fields[model]) {
        object[model] = fields[model];
      }
    });

    return object;
  }
}
