import { Validators } from '@angular/forms';
import { EmployeesService } from './../../../services/employees.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
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
  FieldsAttributesConfig,
} from 'src/app/models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  providers: [{ provide: FormViewService }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit {
  fields$: Observable<FieldsConfig<Employee>> =
    this.employeesService.getFields();

  fields: FieldsConfig<Employee> = {};

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
    'isActive',
    'name',
    'lastName',
    'fruits',
    'bmw',
    'corvette',
    'ferrari',
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
      fruits: {
        col: 6,
      },
      bmw: {
        col: 4,
      },
      ferrari: {
        col: 4,
      },
      corvette: {
        col: 4,
      },
    }
  );

  employeePersonalAttributes$ = new BehaviorSubject<
    FieldsAttributesConfig<Employee>
  >({
    address: {
      disabled: true,
    },
    birthDate: {
      min: new Date(),
    },
    civilStatus: {
      multiple: true,
    },
  });

  onChangeFieldAndHasCountries$!: Observable<boolean>;
  onFetchMoreEmployees$!: Observable<any>;

  constructor(
    public formService: FormViewService,
    private employeesService: EmployeesService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.componentStore$.subscribe((formValue: FormValue) => {
      return (this.formValues = { ...this.formValues });
    });

    this.fields$.subscribe((fields) => {
      this.fields = fields;
      debugger;
    });

    this.handleFetchGames();

    this.onChangeFieldAndHasCountries$.subscribe(() => {
      this.employeePersonalAttributes$.next({
        ...this.employeePersonalAttributes$.getValue(),
        games: {
          isLoading: true,
          disabled: true,
        },
      });

      this.fetchNewGames();
    });
  }

  handleFetchGames() {
    this.onChangeFieldAndHasCountries$ = this.employeePersonalFields$.pipe(
      map(
        (fields: FieldsArrayName<Employee>) =>
          !!fields.find((fieldName) => fieldName === 'games')
      ),
      filter(
        (hasGamesField) =>
          hasGamesField && !this.fields['games']?.options?.length
      )
    );
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
    this.employeePersonalFields$.next([
      'games',
      'country',
      'civilStatus',
      'fruits',
      'bmw',
      'corvette',
      'ferrari',
    ]);
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

  setBirthdayFieldDisabled() {
    this.employeePersonalAttributes$.next({
      ...this.employeePersonalAttributes$.getValue(),
      birthDate: {
        disabled: true,
      },
    });
  }

  setBirthdayFieldEnabled() {
    this.employeePersonalAttributes$.next({
      ...this.employeePersonalAttributes$.getValue(),
      birthDate: {
        disabled: false,
      },
    });
  }

  fetchNewGames() {
    this.http.get('http://localhost:3000/games').subscribe((games: any) => {
      this.employeePersonalAttributes$.next({
        ...this.employeePersonalAttributes$.getValue(),
        games: {
          disabled: false,
          isLoading: false,
        },
      });

      if (this.fields.games) {
        this.fields = {
          ...this.fields,
          games: {
            ...this.fields.games,
            options: games.options,
          },
        };
      }
    });
  }
}
