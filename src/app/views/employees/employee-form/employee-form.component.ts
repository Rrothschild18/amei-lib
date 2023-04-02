import { EmployeesService } from './../../../services/employees.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormViewService } from 'src/app/components/form-view/form-view.service';
import { Employee } from 'src/app/interfaces';
import {
  FieldsConfig,
  FieldsColumnsConfig,
  FieldsValidatorsConfig,
  FieldsArrayName,
  FieldColumnConfigTypes,
} from 'src/app/models';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  providers: [{ provide: FormViewService }],
})
export class EmployeeFormComponent implements OnInit {
  constructor(
    public formService: FormViewService,
    private employeesService: EmployeesService
  ) {}

  fields$: Observable<FieldsConfig<Employee>> =
    this.employeesService.getFields();

  ngOnInit(): void {}

  get employeePersonalColumns(): FieldsColumnsConfig<Employee> {
    return {
      isActive: {
        col: 12,
      },
      name: {
        col: 12,
        lg: 4,
        md: 6,
        sm: 12,
      },
      lastName: {
        md: 12,
        lg: 6,
      },
      document: {
        col: 12,
      },
      phone: {
        col: 6,
      },
      email: {
        lg: 6,
      },
      birthDate: {
        lg: 6,
      },
      games: {
        lg: 6,
      },
      country: {
        lg: 6,
      },
      cep: {
        lg: 4,
      },
      state: {
        col: 4,
      },
      city: {
        col: 4,
      },
      address: {
        col: 8,
      },
      neighborhood: {
        col: 2,
      },
      streetNumber: {
        col: 2,
      },
      complement: {
        col: 12,
      },
    };
  }

  get employeePersonalFields(): FieldsArrayName<Employee> {
    return [
      // 'uuid',
      'isActive',
      'name',
      'lastName',
      'civilStatus',
      'email',
      'document',
      'phone',
      'birthDate',
      'games',
      'country',
      'cep',
      'state',
      'city',
      'neighborhood',
      'address',
      'streetNumber',
      'complement',
    ];
  }

  get employeePersonalValidators(): FieldsValidatorsConfig<Employee> {
    return {};
  }

  filterObject(
    fields: FieldsConfig<Employee>,
    models: FieldsArrayName<Employee>
  ): FieldsConfig<Employee> {
    if (!models.length) {
      throw new Error('Please provide an array of model');
    }

    if (!Object.keys(fields).length) {
      return {} as any;
    }

    const object: any = {};

    models.forEach((model: keyof Employee) => {
      if (fields[model]) {
        object[model] = fields[model];
      }
    });

    return object;
  }
}
