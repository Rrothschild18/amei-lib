import { ActivatedRoute } from '@angular/router';
import { PatientStateModel } from './../../../store/patients/patient.model';
import { Entities } from './../../../store/entities/entities.namespace';
import { HttpClient } from '@angular/common/http';
import { FieldsConfig } from './../../../models/form';
import {
  delay,
  filter,
  first,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  FormValue,
  FormViewService,
} from 'src/app/components/form-view/form-view.service';
import {
  FieldsArrayName,
  FieldsColumnsConfig,
  FieldsValidatorsConfig,
} from 'src/app/models';
import { Patient } from 'src/app/interfaces';
import { FormGeneratorComponent } from 'src/app/components/form-generator/form-generator.component';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
  providers: [{ provide: FormViewService }],
})
export class PatientFormComponent implements OnInit {
  values: any = {};
  componentStore$: Observable<FormValue> = this.formService.formValues;

  @Select('Patient') patient$!: Observable<PatientStateModel>;

  fields: any;

  fetchingCep: boolean = false;

  @ViewChildren('personalForm')
  personalForm!: QueryList<FormGeneratorComponent>;

  @ViewChildren('additionalForm')
  additionalForm!: QueryList<FormGeneratorComponent>;

  @ViewChildren(FormGeneratorComponent)
  formRefs!: QueryList<FormGeneratorComponent>;

  constructor(
    public formService: FormViewService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.componentStore$.subscribe(({ fieldName, value }: FormValue) => {
      if (!fieldName && !value) {
        return {};
      }

      return (this.values = { ...this.values, [fieldName]: value });
    });

    this.fetchNewGamesOptions();
  }

  get mode() {
    return this.route.url.pipe(
      // tap((url) => this.pageMode = url[url.length - 1].path === 'edit' ? 'edit' : 'create')),
      map((url) => (url[url.length - 1].path === 'edit' ? 'edit' : 'create')),
      switchMap((mode) => of(mode))
    );
  }

  ngAfterViewInit() {
    this.handleCepChange();
  }

  /* Bypass until i understand how to 
    pickup formRefs with the service without 
    explicit emit an change
    **/
  ngAfterViewChecked() {
    const formsHasInitializedControls = !!Object.keys(
      this.formRefs.first.form.controls
    ).length;

    if (formsHasInitializedControls) {
      this.formService.setFormRefs(this.formRefs);
      this.cdRef.detectChanges();
    }
  }

  ngOnChanges() {}

  get patientPersonalFields(): FieldsArrayName<Patient> {
    return [
      'uuid',
      'isActive',
      'name',
      'lastName',
      'email',
      'document',
      'phone',
      'birthDate',
      'games',
    ];
  }

  get patientPersonalColumns(): FieldsColumnsConfig<Patient> {
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
    };
  }

  get patientPersonalValidators(): FieldsValidatorsConfig<Patient> {
    return {
      email: [Validators.email, Validators.maxLength(20)],
      lastName: [Validators.nullValidator],
    };
  }

  get patientAdditionalFields(): FieldsArrayName<Patient> {
    return [
      'cep',
      'state',
      'city',
      'neighborhood',
      'address',
      'streetNumber',
      'complement',
    ];
  }

  get patientAdditionalColumns(): FieldsColumnsConfig<Patient> {
    return {
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

  get patientAdditionalValidators(): FieldsValidatorsConfig<Patient> {
    return {
      address: [Validators.maxLength(20)],
    };
  }

  hasFields(fields: {}): boolean {
    return !!Object.keys(fields).length;
  }

  filterObject(
    fields: FieldsConfig<Patient>,
    models: FieldsArrayName<Patient>
  ): FieldsConfig<Patient> {
    if (!models.length) {
      throw new Error('Please provide an array of model');
    }

    if (!Object.keys(fields).length) {
      return {} as any;
    }

    const object: any = {};

    models.forEach((model: keyof Patient) => {
      if (fields[model]) {
        object[model] = fields[model];
      }
    });

    return object;
  }
  //Type this event
  handle(e: any) {
    e.formStore.onFormChanges({
      fieldName: 'name',
      value: e.form.get('name').value,
    });

    e.form.get('name').disable();

    // e.form.valueChanges.subscribe((formValue: any) => {
    //   console.log('Form Value has changed at component', { formValue });
    // });
  }

  handle2(e: any) {
    e.formStore.onFormChanges({
      fieldName: 'cep',
      value: e.form.get('cep').value,
    });

    // e.form.valueChanges.subscribe((formValue: any) => {
    //   console.log('Form Value has changed at component', { formValue });
    // });
  }

  bondForm() {
    this.componentStore$.subscribe((formResponse) => {
      this.values = { ...this.values, ...formResponse };
    });
    return;
  }

  handleClick(fieldRef: FormControl) {
    const cepFieldRef = this.additionalForm?.last?.form.get('cep');
    cepFieldRef?.valueChanges.subscribe((value) => {
      console.log('cep changed', value);
    });
    cepFieldRef?.updateValueAndValidity();
    this.cdRef.detectChanges();
  }

  handleCepChange() {
    this.componentStore$
      .pipe(
        filter(
          (fieldEvent: FormValue) =>
            fieldEvent['fieldName'] === 'cep' &&
            fieldEvent['value'].length === 8
        ),
        tap(() => (this.fetchingCep = true)),
        delay(2000),
        map((fieldEvent) => fieldEvent['value']),
        switchMap((cepValue) =>
          this.http.get(`https://viacep.com.br/ws/${cepValue}/json/`)
        ),
        tap((viaCepResponse) => console.log(viaCepResponse)),
        map((viaCepResponse: any) => {
          return {
            cep: viaCepResponse['cep'],
            city: viaCepResponse['localidade'],
            state: viaCepResponse['uf'],
            neighborhood: viaCepResponse['bairro'] || '',
            address: viaCepResponse['logradouro'] || '',
          };
        }),
        tap((parsedResult) => {
          this.fetchingCep = false;
          this.additionalForm.first.form.patchValue(parsedResult);
        })
      )
      .subscribe((ofResponse) => {
        this.disableCepFields();
      });
  }

  disableCepFields() {
    const cepFieldRef = this.additionalForm?.first?.form.get('cep');
    const stateFieldRef = this.additionalForm?.first?.form.get('state');
    const cityFieldRef = this.additionalForm?.first?.form.get('city');

    cepFieldRef?.disable({ onlySelf: true, emitEvent: true });
    stateFieldRef?.disable({ onlySelf: true, emitEvent: true });
    cityFieldRef?.disable({ onlySelf: true, emitEvent: true });
  }

  fetchNewGamesOptions() {
    this.patient$
      .pipe(
        first((patient) => !!Object.keys(patient.fields).length),
        map((patient) => patient.isLoading),
        filter((isLoading) => !isLoading)
      )
      .subscribe(() => this.fetchNewGames());
  }

  fetchNewGames() {
    this.http
      .get('http://localhost:3000/games')
      .pipe(take(1))
      .subscribe((games) => {
        this.store.dispatch(
          new Entities['Patient'].PatchPatientFields({ games: { ...games } })
        );
      });
  }

  /* Create an helper at formService for error messages**/
  showError(error: any) {
    if (error.required) return 'Este campo é obrigatório';
    if (error.email) return 'E-mail inválido';
    if (error.max) return `Número máximo de caracteres é ${error.max.max}`;
    if (error.maxlength)
      return `Número máximo de caracteres é ${error.maxlength.requiredLength}, atual ${error.maxlength.actualLength}`;
    if (error.min)
      return `Número minimo de caracteres é ${error.min.min}, atual ${error.min.actual}`;

    return 'default error xD';
  }

  onSaveChanges() {
    this.personalForm.first.validateAllFormFields();
    this.additionalForm.first.validateAllFormFields();
  }

  onResetChanges() {
    this.personalForm.first.form.reset();
    this.additionalForm.first.form.reset();
  }
}
