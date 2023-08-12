import { FormComponent } from 'src/app/components/form/form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientStateModel } from './../../../store/patients/patient.model';
import { Entities } from './../../../store/entities/entities.namespace';
import { HttpClient } from '@angular/common/http';
import { FieldsAttributesConfig, FieldsConfig } from './../../../models/form';
import {
  BehaviorSubject,
  catchError,
  delay,
  EMPTY,
  filter,
  first,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientFormComponent implements OnInit {
  values: FormValue = {};
  componentStore$: Observable<FormValue> = this.formService.formValues;

  // @Select('Patient') patient$!: Observable<PatientStateModel>;

  // fetchingCep: boolean = false;

  // @ViewChildren('personalForm')
  // personalForm!: QueryList<FormComponent>;

  // @ViewChildren('additionalForm')
  // additionalForm!: QueryList<FormComponent>;

  // @ViewChildren(FormComponent)
  // formRefs!: QueryList<FormComponent>;

  // isFetchingCep = false;
  // successFullRequestToViaCep = true;

  // // <FieldsValidatorsConfig<Patient>

  // patientAdditionalValidators$ = new BehaviorSubject<
  //   FieldsValidatorsConfig<Patient>
  // >({
  //   address: [Validators.maxLength(20)],
  // });

  // patientAdditionalAttributes$ = new BehaviorSubject<
  //   FieldsAttributesConfig<Patient>
  // >({});

  constructor(
    public formService: FormViewService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {}
  // ngOnInit(): void {
  //   this.componentStore$.subscribe(({ fieldName, value }: FormValue) => {
  //     if (!fieldName && !value) {
  //       return {};
  //     }

  //     return (this.values = { ...this.values, [fieldName]: value });
  //   });

  //   // this.fetchNewGamesOptions();
  //   // this.fetchNewCountryOptions();
  // }

  // get mode$() {
  //   return this.route.url.pipe(
  //     // tap((url) => this.pageMode = url[url.length - 1].path === 'edit' ? 'edit' : 'create')),
  //     map((url) => (url[url.length - 1].path === 'edit' ? 'edit' : 'create')),
  //     switchMap((mode) => of(mode))
  //   );
  // }

  // ngAfterViewInit() {
  //   this.handleCepChange();
  //   this.fetchAllNewOptions();
  // }

  // /* Bypass until i understand how to
  //   pickup formRefs with the service without
  //   explicit emit an change
  //   **/
  // ngAfterViewChecked() {
  //   const formsHasInitializedControls = !!Object.keys(
  //     this.formRefs.first.form.controls
  //   ).length;

  //   if (formsHasInitializedControls) {
  //     this.formService.setFormRefs(this.formRefs);
  //   }
  // }

  // ngOnChanges() {}

  // get patientPersonalFields(): FieldsArrayName<Patient> {
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
  //   ];
  // }

  // get patientPersonalColumns(): FieldsColumnsConfig<Patient> {
  //   return {
  //     isActive: {
  //       col: 12,
  //     },
  //     name: {
  //       col: 12,
  //       lg: 4,
  //       md: 6,
  //       sm: 12,
  //     },
  //     lastName: {
  //       md: 12,
  //       lg: 6,
  //     },
  //     document: {
  //       col: 12,
  //     },
  //     phone: {
  //       col: 6,
  //     },
  //     email: {
  //       lg: 6,
  //     },
  //     birthDate: {
  //       lg: 6,
  //     },
  //     games: {
  //       lg: 6,
  //     },
  //     country: {
  //       lg: 6,
  //     },
  //   };
  // }

  // get patientPersonalValidators(): FieldsValidatorsConfig<Patient> {
  //   return {
  //     email: [Validators.email, Validators.maxLength(20)],
  //     lastName: [Validators.nullValidator],
  //   };
  // }

  // get patientAdditionalFields(): FieldsArrayName<Patient> {
  //   return [
  //     'cep',
  //     'state',
  //     'city',
  //     'neighborhood',
  //     'address',
  //     'streetNumber',
  //     'complement',
  //   ];
  // }

  // get patientAdditionalColumns(): FieldsColumnsConfig<Patient> {
  //   return {
  //     cep: {
  //       lg: 4,
  //     },
  //     state: {
  //       col: 4,
  //     },
  //     city: {
  //       col: 4,
  //     },
  //     address: {
  //       col: 8,
  //     },
  //     neighborhood: {
  //       col: 2,
  //     },
  //     streetNumber: {
  //       col: 2,
  //     },
  //     complement: {
  //       col: 12,
  //     },
  //   };
  // }

  // // get patientAdditionalValidators(): FieldsValidatorsConfig<Patient> {
  // //   return {
  // //     address: [Validators.maxLength(20)],
  // //   };
  // // }

  // //Todo                            FieldsFieldsConfig<Patient>
  // get patientAdditionalFieldEvents(): any {
  //   return {
  //     address: {
  //       onBlur: () => {
  //         //CallBack to fetch ViaCep. Updates state with injected service
  //       },
  //       onClick: () => {},
  //       onMouseEnter: () => {},
  //       onMouseLeave: () => {},
  //     },
  //   };
  // }

  // // get patientAdditionalAttributes(): FieldsAttributesConfig<Patient> {
  // //   return {
  // //     cep: {
  // //       isLoading: this.isFetchingCep,
  // //       disabled: true,
  // //     },
  // //   };
  // // }

  // hasFields(fields: {}): boolean {
  //   return !!Object.keys(fields).length;
  // }

  // filterObject(
  //   fields: FieldsConfig<Patient>,
  //   models: FieldsArrayName<Patient>
  // ): FieldsConfig<Patient> {
  //   if (!models.length) {
  //     throw new Error('Please provide an array of model');
  //   }

  //   if (!Object.keys(fields).length) {
  //     return {} as any;
  //   }

  //   const object: any = {};

  //   models.forEach((model: keyof Patient) => {
  //     if (fields[model]) {
  //       object[model] = fields[model];
  //     }
  //   });

  //   return object;
  // }
  // //Type this event
  // handle(e: any) {
  //   e.formStore.onFormChanges({
  //     fieldName: 'name',
  //     value: e.form.get('name').value,
  //   });

  //   e.form.get('name').disable();

  //   // e.form.valueChanges.subscribe((formValue: any) => {
  //   //   console.log('Form Value has changed at component', { formValue });
  //   // });
  // }

  // handle2(e: {
  //   event: any;
  //   form: FormGroup;
  //   fieldControl: FormControl;
  //   formStore: FormViewService;
  // }) {
  //   e.formStore.onFormChanges({
  //     fieldName: 'cep',
  //     value: e?.form?.get('cep')?.value,
  //   });
  // }

  // bondForm() {
  //   this.componentStore$.subscribe((formResponse) => {
  //     this.values = { ...this.values, ...formResponse };
  //   });
  //   return;
  // }

  // handleClick(fieldRef: FormControl) {
  //   const cepFieldRef = this.additionalForm?.last?.form.get('cep');
  //   cepFieldRef?.valueChanges.subscribe((value) => {
  //     console.log('cep changed', value);
  //   });
  //   cepFieldRef?.updateValueAndValidity();
  //   // this.cdRef.detectChanges();
  // }

  // handleCepChange() {
  //   this.componentStore$
  //     .pipe(
  //       filter(
  //         (fieldEvent: FormValue) =>
  //           fieldEvent['cep'] && fieldEvent['cep']?.length === 8
  //       ),
  //       tap(() => {
  //         this.isFetchingCep = true;
  //         const previousState = this.patientAdditionalAttributes$.getValue();
  //         this.patientAdditionalAttributes$.next({
  //           ...previousState,
  //           cep: {
  //             isLoading: true,
  //             disabled: true,
  //           },
  //         });

  //         debugger;
  //       }),
  //       delay(2000),
  //       map((fieldEvent) => fieldEvent['cep']),
  //       switchMap((cepValue) =>
  //         this.http.get(`https://viacep.com.br/ws/${cepValue}/json/`)
  //       ),
  //       tap((viaCepResponse) => console.log(viaCepResponse)),
  //       map((viaCepResponse: any) => {
  //         return {
  //           cep: viaCepResponse['cep'],
  //           city: viaCepResponse['localidade'],
  //           state: viaCepResponse['uf'],
  //           neighborhood: viaCepResponse['bairro'] || '',
  //           address: viaCepResponse['logradouro'] || '',
  //         };
  //       }),
  //       tap((parsedResult) => {
  //         this.isFetchingCep = false;
  //         const previousState = this.patientAdditionalAttributes$.getValue();

  //         this.patientAdditionalAttributes$.next({
  //           ...previousState,
  //           cep: {
  //             ...previousState['cep'],
  //             isLoading: false,
  //             disabled: true,
  //           },
  //         });
  //         this.additionalForm.first.form.patchValue(parsedResult);
  //       })
  //     )
  //     .subscribe(() => {});
  // }

  // disableCepFields() {
  //   const cepFieldRef = this.additionalForm?.first?.form.get('cep');
  //   const stateFieldRef = this.additionalForm?.first?.form.get('state');
  //   const cityFieldRef = this.additionalForm?.first?.form.get('city');

  //   cepFieldRef?.disable({ onlySelf: true, emitEvent: true });
  //   stateFieldRef?.disable({ onlySelf: true, emitEvent: true });
  //   cityFieldRef?.disable({ onlySelf: true, emitEvent: true });
  // }

  // /** Jeito correto de bater as options aparentemente... */
  // fetchAllNewOptions() {
  //   this.patient$
  //     .pipe(
  //       first((patient) => patient.isLoading),
  //       /** Delay necessario para nao sobrescrever os dispatch dos Fields antes... */
  //       delay(1000),
  //       switchMap(() => {
  //         return forkJoin({
  //           games: this.http.get('http://localhost:3000/games'),
  //           country: this.http.get('http://localhost:3000/country'),
  //         });
  //       }),

  //       map(({ games, country }) =>
  //         this.store.dispatch([
  //           new Entities['Patient'].PatchPatientFields({ games: { ...games } }),
  //           new Entities['Patient'].PatchPatientFields({
  //             country: { ...country },
  //           }),
  //         ])
  //       )
  //     )
  //     .subscribe();
  // }

  // //  * Jeito antigo que batia as options, as actions disparadas podiam ter
  // //  * tempo de resposta diferente e isso bugava o form
  // //  *

  // fetchNewGamesOptions() {
  //   this.patient$
  //     .pipe(first((patient) => patient.isLoading))
  //     .subscribe(() => this.fetchNewGames());
  // }

  // fetchNewGames() {
  //   this.http.get('http://localhost:3000/games').subscribe((games) => {
  //     this.store.dispatch(
  //       new Entities['Patient'].PatchPatientFields({ games: { ...games } })
  //     );
  //   });
  // }

  // fetchNewCountryOptions() {
  //   this.patient$
  //     .pipe(first((patient) => patient.isLoading))
  //     .subscribe(() => this.fetchNewCountries());
  // }

  // fetchNewCountries() {
  //   this.http.get('http://localhost:3000/country').subscribe((country) => {
  //     this.store.dispatch(
  //       new Entities['Patient'].PatchPatientFields({ country: { ...country } })
  //     );
  //   });
  // }

  // //TODO
  // /* Create an helper at formService for error messages**/
  // showError(error: any) {
  //   if (error.required) return 'Este campo é obrigatório';
  //   if (error.email) return 'E-mail inválido';
  //   if (error.max) return `Número máximo de caracteres é ${error.max.max}`;
  //   if (error.maxlength)
  //     return `Número máximo de caracteres é ${error.maxlength.requiredLength}, atual ${error.maxlength.actualLength}`;
  //   if (error.min)
  //     return `Número minimo de caracteres é ${error.min.min}, atual ${error.min.actual}`;

  //   return 'default error xD';
  // }

  // onSaveChanges() {
  //   this.personalForm.first.validateAllFormFields();
  //   this.additionalForm.first.validateAllFormFields();
  // }

  // onResetChanges() {
  //   this.personalForm.first.form.reset();
  //   this.additionalForm.first.form.reset();
  // }

  // onFetchSuccess(storeResponse: Observable<FormValue>) {
  //   storeResponse.pipe(tap(() => this.router.navigate(['/']))).subscribe();
  // }
}
