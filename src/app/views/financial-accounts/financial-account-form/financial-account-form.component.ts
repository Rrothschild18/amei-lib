import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DebugElement,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Validators } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  combineLatest,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  FormValue,
  FormViewService,
} from 'src/app/components/form-view/form-view.service';
import { FormComponent } from 'src/app/components/form/form.component';
import {
  FinancialAccount,
  FinancialAccountAttributes,
  FinancialAccountColumns,
  FinancialAccountFieldNames,
  FinancialAccountFields,
  FinancialAccountValidators,
} from 'src/app/interfaces';
import { FieldsArrayName, FieldsConfig } from 'src/app/models/form';
import { FinancialAccountsService } from 'src/app/services/financial-accounts.service';

@Component({
  selector: 'app-financial-account-form',
  templateUrl: './financial-account-form.component.html',
  styleUrls: ['./financial-account-form.component.scss'],
  providers: [{ provide: FormViewService }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialAccountFormComponent implements OnInit, OnDestroy {
  formValues: FormValue = {};
  formValuesSubscription$!: Subscription;
  financialAccountsFieldsNames$ =
    new BehaviorSubject<FinancialAccountFieldNames>([
      'unidadeId',
      'tipoContaId',
    ]);

  financialAccountsColumns$ = new BehaviorSubject<FinancialAccountColumns>({
    unidadeId: {
      col: 4,
    },
    tipoContaId: {
      col: 4,
    },
    nome: {
      col: 4,
    },
    contaLiquidacao: {
      col: 4,
    },
    bancoId: {
      col: 4,
    },
    agencia: {
      col: 4,
    },
    numero: {
      col: 4,
    },
    titulo: {
      col: 4,
    },
    documento: {
      col: 4,
    },
  });

  financialAccountsValidators$ =
    new BehaviorSubject<FinancialAccountValidators>({
      unidadeId: [Validators.nullValidator],
    });

  financialAccountsAttributes$ =
    new BehaviorSubject<FinancialAccountAttributes>({
      contaLiquidacao: {
        multiple: true,
      },
    });

  fieldsSubscription$!: Subscription;

  financialAccountsFields$ = new BehaviorSubject<FinancialAccountFields>({});

  destroy$ = new Subject();

  @ViewChildren(FormComponent)
  formRefs!: QueryList<FormComponent>;

  hasLoadedUnityOptions$ = this.financialAccountsFields$.pipe(
    distinctUntilChanged(),
    filter((fields) => !!fields.unidadeId?.options?.length),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  hasUnityOptionsValue$ = this.formService.formValues.pipe(
    distinctUntilChanged(),
    filter((fields) => !!fields?.['unidadeId']?.value),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  disableUnityFormField$!: Subscription;

  //FormEvents
  accountTypeIsPhysicalBox$!: Observable<boolean>;
  loadPhysicalBoxFieldsSubs$!: Subscription;

  //FormEvents
  accountTypeIsBankAccount$!: Observable<boolean>;
  loadBankAccountFieldsSubs$!: Subscription;

  constructor(
    private financialAccountService: FinancialAccountsService,
    private cdRef: ChangeDetectorRef,
    public formService: FormViewService
  ) {}

  ngOnInit(): void {
    this.formValuesSubscription$ = this.formService.formValues.subscribe(
      ({ fieldName, value }) => {
        if (!fieldName && !value) {
          return {};
        }

        return (this.formValues = { ...this.formValues, [fieldName]: value });
      }
    );

    this.getFinancialAccountsFields();
    this.getCurrentClinic();
    this.setUnityFieldDisabled();
    this.getAccountTypes();

    this.isAccountTypePhysical();
    this.isAccountTypeBank();

    this.watchAccountTypeValuePhysicalAndEnableFields();
    this.watchAccountTypeValuePhysicalAndFetchFormReceipts();

    this.watchAccountTypeValueBankAndEnableFields();
    this.watchAccountTypeValuePhysicalAndFetchBanks();

    this.watchAccountTypeValueCard();
  }

  ngOnDestroy(): void {
    this.fieldsSubscription$ && this.fieldsSubscription$.unsubscribe();
    this.disableUnityFormField$ && this.disableUnityFormField$.unsubscribe();
    this.loadPhysicalBoxFieldsSubs$ &&
      this.loadPhysicalBoxFieldsSubs$.unsubscribe();
  }

  isAccountTypePhysical() {
    this.accountTypeIsPhysicalBox$ = this.formService.formValues.pipe(
      filter(
        (formResponse) =>
          formResponse?.['fieldName'] === 'tipoContaId' &&
          formResponse?.['value'] === '1'
      ),
      map(() => true)
    );
  }

  isAccountTypeBank() {
    this.accountTypeIsBankAccount$ = this.formService.formValues.pipe(
      filter(
        (formResponse) =>
          formResponse?.['fieldName'] === 'tipoContaId' &&
          formResponse?.['value'] === '3'
      ),
      map(() => true)
    );
  }

  ngAfterViewInit() {
    this.formService.setFormRefs(this.formRefs);
  }

  getFinancialAccountsFields() {
    this.fieldsSubscription$ = this.financialAccountService
      .getFields()
      .subscribe((fields) => this.financialAccountsFields$.next(fields));
  }

  getCurrentClinic() {
    this.financialAccountService
      .getCurrentClinic()
      .pipe(takeUntil(this.destroy$))
      .subscribe((clinic) => {
        const currentState = this.financialAccountsFields$.getValue();

        if (currentState.unidadeId && currentState.unidadeId.options) {
          this.financialAccountsFields$.next({
            ...currentState,
            unidadeId: {
              ...currentState.unidadeId,
              options: [...currentState.unidadeId.options, clinic],
            },
          });
        }
      });
  }

  getAccountTypes() {
    this.financialAccountService
      .getCurrentAccountsRelatedTypes()
      .pipe(
        map((accTypes) =>
          accTypes.map((accountType) => ({
            label: accountType.tipoContaCorrente,
            value: `${accountType.id}`,
          }))
        )
      )
      .subscribe((accountTypes) => {
        const currentState = this.financialAccountsFields$.getValue();

        if (currentState.tipoContaId && currentState.tipoContaId.options) {
          this.financialAccountsFields$.next({
            ...currentState,
            tipoContaId: {
              ...currentState.tipoContaId,
              options: [...currentState.tipoContaId.options, ...accountTypes],
            },
          });
        }
      });
  }

  setUnityFieldDisabled() {
    this.disableUnityFormField$ = combineLatest({
      loadedOptions: this.hasLoadedUnityOptions$,
      hasForm: this.formService.formRefs,
    }).subscribe(() => {
      this.formRefs.first.form.get('unidadeId')?.setValue('100');
      //Detect changes because field errors are getting error  NG0100: Expression has changed after it was checked
      //Fields need refactor as ViewModel or a specific service to deal with changes
      this.cdRef.detectChanges();
      const state = this.financialAccountsAttributes$.getValue();
      this.financialAccountsAttributes$.next({
        ...state,
        unidadeId: {
          disabled: true,
        },
      });
    });
  }

  watchAccountTypeValuePhysicalAndEnableFields() {
    this.loadPhysicalBoxFieldsSubs$ = this.accountTypeIsPhysicalBox$.subscribe(
      () => {
        this.financialAccountsFieldsNames$.next([
          'unidadeId',
          'tipoContaId',
          'nome',
          'contaLiquidacao',
        ]);
      }
    );
  }

  watchAccountTypeValuePhysicalAndFetchFormReceipts() {
    combineLatest({
      physicalBox: this.accountTypeIsPhysicalBox$.pipe(startWith(false)),
      bank: this.accountTypeIsBankAccount$.pipe(startWith(false)),
    })
      .pipe(
        filter(({ physicalBox, bank }) => physicalBox || bank),
        switchMap(() => {
          return this.financialAccountService
            .listFormsOfSettlement({
              tipoOperacaoId: 1,
            })
            .pipe(
              map((formSettlements) =>
                formSettlements.map((formSettlement) => ({
                  label: formSettlement.formaLiquidacao,
                  value: `${formSettlement.id}`,
                }))
              )
            );
        })
      )
      .subscribe((formSettlements) => {
        const currentState = this.financialAccountsFields$.getValue();
        if (
          currentState.contaLiquidacao &&
          currentState.contaLiquidacao.options
        ) {
          this.financialAccountsFields$.next({
            ...currentState,
            contaLiquidacao: {
              ...currentState.contaLiquidacao,
              options: [...formSettlements],
            },
          });
        }

        this.formRefs.first.form.get('contaLiquidacao')?.setValue(['1']);
      });
  }

  watchAccountTypeValueCard() {}

  watchAccountTypeValueBankAndEnableFields() {
    this.loadBankAccountFieldsSubs$ = this.accountTypeIsBankAccount$.subscribe(
      () => {
        this.financialAccountsFieldsNames$.next([
          'unidadeId',
          'tipoContaId',
          'nome',
          'contaLiquidacao',
          'bancoId',
          'agencia',
          'numero',
          'titulo',
          'documento',
        ]);
      }
    );
  }

  watchAccountTypeValuePhysicalAndFetchBanks() {
    this.accountTypeIsBankAccount$
      .pipe(
        switchMap(() => {
          return this.financialAccountService
            .listBanksWithFilters({
              page: 1,
              limit: 999,
            })
            .pipe(
              map((banks) =>
                banks.items.map((bank) => ({
                  label: bank.nomeBanco,
                  value: `${bank.id}`,
                }))
              )
            );
        })
      )
      .subscribe((banks) => {
        const currentState = this.financialAccountsFields$.getValue();
        if (currentState.bancoId && currentState.bancoId.options) {
          this.financialAccountsFields$.next({
            ...currentState,
            bancoId: {
              ...currentState.bancoId,
              options: [...banks],
            },
          });
        }

        this.formRefs.first.form.get('contaLiquidacao')?.setValue(['1']);
      });
  }

  filterObject(
    fields: FieldsConfig<FinancialAccount>,
    models: FieldsArrayName<FinancialAccount>
  ): FieldsConfig<FinancialAccount> {
    if (!models.length) {
      throw new Error('Please provide an array of model');
    }

    if (!Object.keys(fields).length) {
      return {} as any;
    }

    const object: any = {};

    models.forEach((model: keyof FinancialAccount) => {
      if (fields[model]) {
        object[model] = fields[model];
      }
    });

    return object;
  }
}