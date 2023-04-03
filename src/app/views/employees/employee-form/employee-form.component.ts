import { Validators } from '@angular/forms';
import { EmployeesService } from './../../../services/employees.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  FormValue,
  FormViewService,
} from 'src/app/components/form-view/form-view.service';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit {
  constructor(
    public formService: FormViewService,
    private employeesService: EmployeesService
  ) {}

  fields$: Observable<FieldsConfig<Employee>> =
    this.employeesService.getFields();

  componentStore$: Observable<FormValue> = this.formService.formValues;

  formValues: any;

  employeePersonalValidators$ = new BehaviorSubject<
    FieldsValidatorsConfig<Employee>
  >({
    email: [Validators.email, Validators.maxLength(20)],
    lastName: [Validators.nullValidator],
    address: [Validators.nullValidator],
  });

  employeePersonalFields$ = new BehaviorSubject<FieldsArrayName<Employee>>([
    // 'uuid',
    'isActive',
  ]);

  employeePersonalColumns$ = new BehaviorSubject<FieldsColumnsConfig<Employee>>(
    {
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
    }
  );

  ngOnInit(): void {
    this.componentStore$.subscribe(({ fieldName, value }: FormValue) => {
      if (!fieldName && !value) {
        return {};
      }

      return (this.formValues = { ...this.formValues, [fieldName]: value });
    });
  }

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

  // get employeePersonalFields(): FieldsArrayName<Employee> {
  //   return [
  //     // 'uuid',
  //     'isActive',
  //     'name',
  //     'lastName',
  //     'civilStatus',
  //     'email',
  //     'document',
  //     'phone',
  //     'birthDate',
  //     'games',
  //     'country',
  //     'cep',
  //     'state',
  //     'city',
  //     'neighborhood',
  //     'address',
  //     'streetNumber',
  //     'complement',
  //   ];
  // }

  // get employeePersonalValidators(): FieldsValidatorsConfig<Employee> {
  //   return {
  //     email: [Validators.email, Validators.maxLength(20)],
  //     lastName: [Validators.nullValidator],
  //     address: [Validators.nullValidator],
  //   };
  // }

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

  resetValidations() {
    this.employeePersonalValidators$.next({
      isActive: [Validators.nullValidator],
      name: [Validators.nullValidator],
      lastName: [Validators.nullValidator],
      document: [Validators.nullValidator],
      phone: [Validators.nullValidator],
      email: [Validators.nullValidator],
      birthDate: [Validators.nullValidator],
      civilStatus: [Validators.nullValidator],
      games: [Validators.nullValidator],
      country: [Validators.nullValidator],
      cep: [Validators.nullValidator],
      state: [Validators.nullValidator],
      city: [Validators.nullValidator],
      address: [Validators.nullValidator],
      neighborhood: [Validators.nullValidator],
      streetNumber: [Validators.nullValidator],
      complement: [Validators.nullValidator],
    });
  }

  changeFields() {
    this.employeePersonalFields$.next(['games', 'country', 'civilStatus']);
  }

  changeFields2() {
    this.employeePersonalFields$.next([
      ...this.employeePersonalFields$.getValue(),
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
    ]);
  }

  resetColumns() {
    this.employeePersonalColumns$.next({});
  }

  setColumnsToOriginal() {
    this.employeePersonalColumns$.next({
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
    });
  }
}
