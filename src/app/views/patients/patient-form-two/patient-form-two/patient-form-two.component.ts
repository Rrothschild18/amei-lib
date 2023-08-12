import {
  PatientAddressAttributes,
  PatientAddressColumns,
  PatientAddressFieldNames,
  PatientAddressFields,
  PatientAddressValidators,
  PatientContactAttributes,
  PatientContactColumns,
  PatientContactFieldNames,
  PatientContactFields,
  PatientContactValidators,
  PatientFields,
  PatientGeneralAttributes,
  PatientGeneralFields,
} from './../../../../interfaces/patient.interface';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subscription,
  catchError,
  concatMap,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  FormValue,
  FormViewService,
} from './../../../../components/form-view/form-view.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  EFinancialAccountType,
  PatientFieldGeneralNames,
  PatientGeneralColumns,
  PatientGeneralValidators,
} from 'src/app/interfaces';
import { PatientService } from 'src/app/services/patient.service';
import { AutocompleteOption } from 'src/app/components/autocomplete/multiselect-autocomplete.interface';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-form-two',
  templateUrl: './patient-form-two.component.html',
  styleUrls: ['./patient-form-two.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormViewService],
})
export class PatientFormTwoComponent implements OnInit {
  formValues: FormValue = {};
  formValuesSubscription$!: Subscription;
  subSink$ = new Subscription();

  patientFields$!: Observable<PatientFields>;

  //General Information Form
  generalFieldsNames$ = new BehaviorSubject<PatientFieldGeneralNames>([]);
  patientGeneralColumns$ = new BehaviorSubject<PatientGeneralColumns>({});
  patientGeneralValidators$ = new BehaviorSubject<PatientGeneralValidators>({});
  patientGeneralAttributes$ = new BehaviorSubject<PatientGeneralAttributes>({});
  patientGeneralFields$ = new BehaviorSubject<PatientGeneralFields>({});

  origins$!: Observable<AutocompleteOption[]>;

  // Contact Form
  contactFieldsNames$ = new BehaviorSubject<PatientContactFieldNames>([]);
  patientContactColumns$ = new BehaviorSubject<PatientContactColumns>({});
  patientContactValidators$ = new BehaviorSubject<PatientContactValidators>({});
  patientContactAttributes$ = new BehaviorSubject<PatientContactAttributes>({});
  patientContactFields$ = new BehaviorSubject<PatientContactFields>({});

  // Address Form
  addressFieldsNames$ = new BehaviorSubject<PatientAddressFieldNames>([]);
  patientAddressColumns$ = new BehaviorSubject<PatientAddressColumns>({});
  patientAddressValidators$ = new BehaviorSubject<PatientAddressValidators>({});
  patientAddressAttributes$ = new BehaviorSubject<PatientAddressAttributes>({});
  patientAddressFields$ = new BehaviorSubject<PatientAddressFields>({});

  isEditMode$!: Observable<boolean>;
  isCreateMode$!: Observable<boolean>;

  constructor(
    public formService: FormViewService,
    private patientService: PatientService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.formValuesSubscription$ = this.formService.formValues.subscribe(
      (values) => (this.formValues = { ...this.formValues, ...values })
    );
  }

  ngOnInit(): void {
    this.fetchPatientFields();

    this.initializeGeneralFields();
    this.initializeContactFields();
    this.initializeAddressFields();

    this.setUpGeneralFieldsColumns();
    this.setUpContactColumns();
    this.setUpAddressColumns();

    this.setUpAddressAttributes();

    this.fetchAllComboBox();
    this.fetchOrigins();

    this.watchCEPChanges();

    this.isEditMode$ = this.route.url.pipe(
      filter((url) => url[url.length - 1].path === 'edit'),
      map(() => true)
    );

    this.isCreateMode$ = this.route.url.pipe(
      filter((url) => url[url.length - 1].path === 'new'),
      map(() => true)
    );

    const isEditSubs = this.isEditMode$
      .pipe(
        concatMap(() =>
          this.patientService.getPatientById(
            +this.route.snapshot.paramMap.get('id')! ?? 0
          )
        ),
        tap((patient) => {
          this.formService.formValues.next(patient);
        })
      )
      .subscribe(() => {});

    this.subSink$.add(isEditSubs);
  }

  initializeGeneralFields() {
    if (this.generalFieldsNames$.getValue().length) {
      return;
    }

    this.generalFieldsNames$.next([
      'cpf',
      'nome',
      'sobrenome',
      'nomeSocial',
      'rg',
      'dataNascimento',
      'nomeMae',
      'naturalidade',
      'nacionalidade',
      'etnia',
      'sexo',
      'genero',
      'cns',
      'estadoCivil',
      'profissao',
      'origem',
      'prioridade',
      'dataCadastro',
      'restricoesTratamentoMedico',
      'obito',
    ]);
  }

  initializeContactFields() {
    if (this.contactFieldsNames$.getValue().length) {
      return;
    }

    this.contactFieldsNames$.next([
      'email',
      'celular',
      'celularAlternativo',
      'telefone',
    ]);
  }

  initializeAddressFields() {
    if (this.addressFieldsNames$.getValue().length) {
      return;
    }

    this.addressFieldsNames$.next([
      'cep',
      'estado',
      'cidade',
      'bairro',
      'endereco',
      'numero',
      'complemento',
    ]);
  }

  setUpGeneralFieldsColumns() {
    if (Object.values(this.patientGeneralColumns$.getValue()).length) {
      return;
    }

    this.patientGeneralColumns$.next({
      cpf: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      nome: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      sobrenome: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      nomeSocial: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      rg: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      dataNascimento: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      nomeMae: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      naturalidade: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      nacionalidade: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      etnia: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      sexo: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      genero: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      cns: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      estadoCivil: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      profissao: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      origem: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      prioridade: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      dataCadastro: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      restricoesTratamentoMedico: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      obito: {
        lg: 4,
        md: 6,
        sm: 6,
      },
    });
  }

  setUpContactColumns() {
    if (Object.values(this.patientContactColumns$.getValue()).length) {
      return;
    }

    this.patientContactColumns$.next({
      telefone: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      celular: { lg: 4, md: 6, sm: 6 },
      celularAlternativo: { lg: 4, md: 6, sm: 6 },
    });
  }

  setUpAddressColumns() {
    if (Object.values(this.patientAddressColumns$.getValue()).length) {
      return;
    }

    this.patientAddressColumns$.next({
      cep: {
        lg: 2,
        md: 6,
        sm: 6,
      },
      endereco: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      numero: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      complemento: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      bairro: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      cidade: {
        lg: 4,
        md: 6,
        sm: 6,
      },
      estado: {
        lg: 2,
        md: 6,
        sm: 6,
      },
    });
  }

  setUpAddressAttributes() {
    if (Object.values(this.patientAddressAttributes$.getValue()).length) {
      return;
    }

    this.patientAddressAttributes$.next({
      cep: {
        mask: '00000-000',
        maxlength: 8,
      },
    });
  }

  fetchPatientFields(): Observable<PatientFields> {
    return (this.patientFields$ = this.patientService.getPatientFields());
  }

  fetchOrigins() {
    this.origins$ = of([] as AutocompleteOption[]);
  }

  fetchAllComboBox() {}

  //computed

  watchCEPChanges() {
    const subs = this.formService.formValues
      .pipe(
        debounceTime(500),
        filter((formValues) => formValues['cep']),
        map((formValues) => formValues['cep']),
        filter((cep: string) => cep.length === 8),
        distinctUntilChanged(),
        switchMap((cepValue) =>
          this.http.get(`https://viacep.com.br/ws/${cepValue}/json/`).pipe(
            tap((response: any) => {
              if (response.erro) {
                throw new Error('Via Cep error ');
              }
            }),
            tap(() => {
              const state = this.patientAddressAttributes$.getValue();
              this.patientAddressAttributes$.next({
                ...state,
                cep: {
                  ...state.cep,
                  disabled: true,
                },
              });
            }),
            delay(2000),

            tap((values: any) => {
              const {
                cep = '',
                logradouro: endereco = '',
                complemento = '',
                bairro = '',
                localidade: cidade = '',
                uf: estado = '',
              } = values;

              this.formService.formValues.next({
                ...this.formValues,
                cep,
                endereco,
                complemento,
                bairro,
                cidade,
                estado,
              });

              const state = this.patientAddressAttributes$.getValue();
              this.patientAddressAttributes$.next({
                ...state,
                cep: {
                  ...state.cep,
                  disabled: true,
                },
                endereco: {
                  disabled: true,
                },
                bairro: {
                  disabled: true,
                },
                cidade: {
                  disabled: true,
                },
                estado: {
                  disabled: true,
                },
              });
            }),
            catchError((e) => {
              console.log({ e });
              const state = this.patientAddressAttributes$.getValue();
              this.patientAddressAttributes$.next({
                ...state,
                cep: {
                  ...state.cep,
                  disabled: false,
                },
                endereco: {
                  disabled: false,
                },
                bairro: {
                  disabled: false,
                },
                cidade: {
                  disabled: false,
                },
                estado: {
                  disabled: false,
                },
              });
              return of({});
            })
          )
        )
      )
      .subscribe();

    this.subSink$.add(subs);
  }
}
