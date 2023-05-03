import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Validators } from '@angular/forms';
import {
  Subscription,
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  shareReplay,
  Observable,
  Subject,
  map,
  takeUntil,
  combineLatest,
  startWith,
  switchMap,
} from 'rxjs';
import {
  FormValue,
  FormViewService,
} from 'src/app/components/form-view/form-view.service';
import { FormComponent } from 'src/app/components/form/form.component';
import {
  FinancialAccountFieldNames,
  FinancialAccountColumns,
  FinancialAccountValidators,
  FinancialAccountAttributes,
  FinancialAccountFields,
  EFinancialAccountType,
  EFinancialAccountModality,
  ENumberAccountReceiveForms,
  FinancialAccount,
} from 'src/app/interfaces';
import { FieldsConfig, FieldsArrayName } from 'src/app/models';
import { FinancialAccountsService } from 'src/app/services/financial-accounts.service';

@Component({
  selector: 'app-financial-account-form-two',
  templateUrl: './financial-account-form-two.component.html',
  styleUrls: ['./financial-account-form-two.component.scss'],
  providers: [{ provide: FormViewService }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialAccountFormTwoComponent implements OnInit, OnDestroy {
  formValues: FormValue = {};
  formValuesSubscription$!: Subscription;
  financialAccountsFieldsNames$ =
    new BehaviorSubject<FinancialAccountFieldNames>([
      'unidadeId',
      'tipoContaId',
    ]);

  financialAccountsColumns$ = new BehaviorSubject<FinancialAccountColumns>({});

  financialAccountsValidators$ =
    new BehaviorSubject<FinancialAccountValidators>({
      unidadeId: [Validators.nullValidator],
    });

  financialAccountsAttributes$ =
    new BehaviorSubject<FinancialAccountAttributes>({
      contaLiquidacao: {
        multiple: true,
      },
      tipoContaId: {
        hideRequiredMarker: true,
      },
    });

  financialAccountsFields$ = new BehaviorSubject<FinancialAccountFields>({});

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

  //FormEvents
  accountTypeIsPhysicalBox$!: Observable<boolean>;
  accountTypeIsBank$!: Observable<boolean>;
  accountTypeIsCard$!: Observable<boolean>;

  isModalityCreditPayments$!: Observable<boolean>;
  isModalityCreditReceipts$!: Observable<boolean>;
  isModalityDebitReceipts$!: Observable<boolean>;

  private subscriptionsSink$ = new Subscription();
  private destroy$ = new Subject();

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

    this.setUpFieldColumns();

    this.getFinancialAccountsFields();
    this.getCurrentClinic();
    this.setUnityFieldDisabled();
    this.getAccountTypes();

    //computed properties
    this.isAccountTypePhysical();
    this.isAccountTypeCard();
    this.isAccountTypeBank();
    this.isModalityCreditPayments();
    this.isModalityCreditReceipts();
    this.isModalityDebitReceipts();

    this.watchAccountTypeValuePhysicalAndEnableFields();
    this.watchAccountTypeValuePhysicalAndFetchFormReceipts();

    this.watchAccountTypeValueBankAndEnableFields();
    this.watchAccountTypeValueBankAndFetchBanksAccounts();

    this.watchAccountTypeValueCardAndEnableFields();
    this.watchAccountTypeValueCardAndFetchModalities();
    this.watchAccountTypeValueCardAndFetchAccountsFormReceipts();

    this.watchAccountModalityCreditPaymentsAndEnableFields();
    this.watchAccountModalityCreditReceiptsAndEnableFields();
    this.watchAccountModalityDebitReceiptsAndEnableFields();
  }

  ngAfterViewInit() {
    this.formService.setFormRefs(this.formRefs);
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
    this.subscriptionsSink$.unsubscribe();
  }

  isAccountTypePhysical() {
    this.accountTypeIsPhysicalBox$ = this.formService.formValues.pipe(
      filter(
        ({ fieldName, value }) =>
          fieldName === 'tipoContaId' &&
          value === EFinancialAccountType.CAIXA_FISICO
      ),
      map(({ value }) => value === EFinancialAccountType.CAIXA_FISICO)
    );
  }

  isAccountTypeBank() {
    this.accountTypeIsBank$ = this.formService.formValues.pipe(
      filter(
        ({ fieldName, value }) =>
          fieldName === 'tipoContaId' &&
          value === EFinancialAccountType.CONTA_BANCARIA
      ),
      map(() => true)
    );
  }

  isAccountTypeCard() {
    this.accountTypeIsCard$ = this.formService.formValues.pipe(
      filter(
        ({ fieldName, value }) =>
          fieldName === 'tipoContaId' && value === EFinancialAccountType.CARTAO
      ),
      map(() => true)
    );
  }

  isModalityCreditPayments() {
    this.isModalityCreditPayments$ = this.formService.formValues.pipe(
      filter(
        ({ fieldName, value }) =>
          fieldName === 'modalidadeId' &&
          value === EFinancialAccountModality.CC_PAGAMENTO
      ),
      map(() => true)
    );
  }

  isModalityCreditReceipts() {
    this.isModalityCreditReceipts$ = this.formService.formValues.pipe(
      filter(
        ({ fieldName, value }) =>
          fieldName === 'modalidadeId' &&
          value === EFinancialAccountModality.CC_RECEBIMENTO
      ),
      map(() => true)
    );
  }

  isModalityDebitReceipts() {
    this.isModalityDebitReceipts$ = this.formService.formValues.pipe(
      filter(
        ({ fieldName, value }) =>
          fieldName === 'modalidadeId' &&
          value === EFinancialAccountModality.CD_RECEBIMENTO
      ),
      map(() => true)
    );
  }

  getFinancialAccountsFields() {
    this.financialAccountService
      .getFields()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fields) => this.financialAccountsFields$.next(fields));
  }

  getCurrentClinic() {
    this.financialAccountService
      .getCurrentClinic()
      .pipe(takeUntil(this.destroy$))
      .subscribe((clinic) => {
        const currentState = this.financialAccountsFields$.getValue();

        if (currentState.unidadeId) {
          this.financialAccountsFields$.next({
            ...currentState,
            unidadeId: {
              ...currentState.unidadeId,
              options: [clinic],
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
          accTypes
            .map((accountType) => ({
              label: accountType.tipoContaCorrente,
              value: `${accountType.id}`,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label))
        )
      )
      .subscribe((accountTypes) => {
        const currentState = this.financialAccountsFields$.getValue();

        if (currentState.tipoContaId) {
          this.financialAccountsFields$.next({
            ...currentState,
            tipoContaId: {
              ...currentState.tipoContaId,
              options: [...accountTypes],
            },
          });
        }
      });
  }

  setUnityFieldDisabled() {
    const disableUnityFormField$ = combineLatest({
      loadedOptions: this.hasLoadedUnityOptions$,
      hasForm: this.formService.formRefs,
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.formRefs.first.form.get('unidadeId')?.setValue('1');
        //Detect changes because field errors are getting error  NG0100: Expression has changed after it was checked
        //Fields need refactor as ViewModel State or a specific service to deal with changes
        this.cdRef.detectChanges();
        const state = this.financialAccountsAttributes$.getValue();
        this.financialAccountsAttributes$.next({
          ...state,
          unidadeId: {
            disabled: true,
          },
        });
      });

    this.subscriptionsSink$.add(disableUnityFormField$);
  }

  watchAccountTypeValuePhysicalAndEnableFields() {
    const loadPhysicalBoxFieldsSubs$ = this.accountTypeIsPhysicalBox$.subscribe(
      () => {
        this.financialAccountsFieldsNames$.next([
          'unidadeId',
          'tipoContaId',
          'nome',
          'contaLiquidacao',
        ]);
      }
    );

    this.subscriptionsSink$.add(loadPhysicalBoxFieldsSubs$);
  }

  watchAccountTypeValuePhysicalAndFetchFormReceipts() {
    combineLatest({
      physicalBox: this.accountTypeIsPhysicalBox$.pipe(startWith(false)),
      bank: this.accountTypeIsBank$.pipe(startWith(false)),
      creditReceipt: this.isModalityCreditReceipts$.pipe(startWith(false)),
      debitReceipt: this.isModalityDebitReceipts$.pipe(startWith(false)),
    })
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ({ physicalBox, bank, creditReceipt, debitReceipt }) =>
            physicalBox || bank || creditReceipt || debitReceipt
        ),
        switchMap(() => {
          return this.financialAccountService
            .listFormsOfSettlement({
              tipoOperacaoId: 1,
            })
            .pipe(
              map((formSettlements) =>
                formSettlements
                  .map((formSettlement) => ({
                    label: formSettlement.formaLiquidacao,
                    value: `${formSettlement.id}`,
                  }))
                  .sort((a: any, b: any) => a.label.localeCompare(b.label))
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

        const { modalidadeId } = this.formValues;
        const receiptsFieldRef =
          this.formRefs.first.form.get('contaLiquidacao');

        if (modalidadeId === EFinancialAccountModality.CC_RECEBIMENTO) {
          receiptsFieldRef?.setValue([
            ENumberAccountReceiveForms.CARTAO_CREDITO,
          ]);
          return;
        }

        if (modalidadeId === EFinancialAccountModality.CD_RECEBIMENTO) {
          receiptsFieldRef?.setValue([
            ENumberAccountReceiveForms.CARTAO_DEBITO,
          ]);
          return;
        }

        receiptsFieldRef?.setValue([ENumberAccountReceiveForms.DINHEIRO]);
      });
  }

  watchAccountTypeValueBankAndEnableFields() {
    const loadBankAccountFieldsSubs$ = this.accountTypeIsBank$.subscribe(() => {
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
    });

    this.subscriptionsSink$.add(loadBankAccountFieldsSubs$);
  }

  watchAccountTypeValueBankAndFetchBanksAccounts() {
    this.accountTypeIsBank$
      .pipe(
        switchMap(() => {
          return this.financialAccountService
            .listBanksWithFilters({
              page: 1,
              limit: 999,
            })
            .pipe(
              map((banks) =>
                banks.items
                  .map((bank) => ({
                    label: bank.nomeBanco,
                    value: `${bank.id}`,
                  }))
                  .sort((a: any, b: any) => a.label.localeCompare(b.label))
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
      });
  }

  watchAccountTypeValueCardAndEnableFields() {
    const loadCardFieldsSubs$ = this.accountTypeIsCard$.subscribe(() => {
      this.financialAccountsFieldsNames$.next([
        'unidadeId',
        'tipoContaId',
        'nome',
        'modalidadeId',
        'contaRecebimentoId',
        'flagTef',
        'flagSplit',
        'diasCreditoConta',
      ]);
    });

    this.subscriptionsSink$.add(loadCardFieldsSubs$);
  }

  watchAccountTypeValueCardAndFetchModalities() {
    this.accountTypeIsCard$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return this.financialAccountService.listModalities().pipe(
            map((modalities) =>
              modalities
                .map((modality) => ({
                  label: modality.modalidade,
                  value: `${modality.id}`,
                }))
                .sort((a: any, b: any) => a.label.localeCompare(b.label))
            )
          );
        })
      )
      .subscribe((modalities) => {
        const currentState = this.financialAccountsFields$.getValue();

        if (currentState.modalidadeId && currentState.modalidadeId.options) {
          this.financialAccountsFields$.next({
            ...currentState,
            modalidadeId: {
              ...currentState.modalidadeId,
              options: [...modalities],
            },
          });
        }
      });
  }

  watchAccountTypeValueCardAndFetchAccountsFormReceipts() {
    this.accountTypeIsCard$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return this.financialAccountService
            .listAccountsForReceipt({
              unidadeId: this.formValues['unidadeId'],
              tipoContaId: this.formValues['tipoContaId'],
            })
            .pipe(
              map((accounts) =>
                accounts
                  .map((account) => ({
                    label: account.banco,
                    value: `${account.id}`,
                  }))
                  .sort((a: any, b: any) => a.label.localeCompare(b.label))
              )
            );
        })
      )
      .subscribe((accounts) => {
        const currentState = this.financialAccountsFields$.getValue();

        if (
          currentState.contaRecebimentoId &&
          currentState.contaRecebimentoId.options
        ) {
          this.financialAccountsFields$.next({
            ...currentState,
            contaRecebimentoId: {
              ...currentState.contaRecebimentoId,
              options: [...accounts],
            },
          });
        }
      });
  }

  watchAccountModalityCreditPaymentsAndEnableFields() {
    const loadModalityCreditPaymentsSubs$ =
      this.isModalityCreditPayments$.subscribe(() => {
        this.financialAccountsFieldsNames$.next([
          'unidadeId',
          'tipoContaId',
          'nome',
          'modalidadeId',
          'contaRecebimentoId',
          'flagTef',
          'flagSplit',
          'diasCreditoConta',
          'melhorDiaCompra',
          'diasCreditoConta',
          'diaVencimento',
        ]);
      });

    this.subscriptionsSink$.add(loadModalityCreditPaymentsSubs$);
  }

  watchAccountModalityCreditReceiptsAndEnableFields() {
    const loadModalityCreditReceiptsFieldsSubs$ =
      this.isModalityCreditReceipts$.subscribe(() => {
        this.financialAccountsFieldsNames$.next([
          'unidadeId',
          'tipoContaId',
          'nome',
          'modalidadeId',
          'contaLiquidacao',
          'contaRecebimentoId',
          'flagTef',
          'flagSplit',
          'diasCreditoConta',
          'diasCreditoConta',
        ]);
      });

    this.subscriptionsSink$.add(loadModalityCreditReceiptsFieldsSubs$);
  }

  watchAccountModalityDebitReceiptsAndEnableFields() {
    const loadModalityDebitReceiptsFieldsSubs$ =
      this.isModalityDebitReceipts$.subscribe(() => {
        this.financialAccountsFieldsNames$.next([
          'unidadeId',
          'tipoContaId',
          'nome',
          'modalidadeId',
          'contaLiquidacao',
          'contaRecebimentoId',
          'flagTef',
          'flagSplit',
          'diasCreditoConta',
          'diasCreditoConta',
        ]);
      });

    this.subscriptionsSink$.add(loadModalityDebitReceiptsFieldsSubs$);
  }

  setUpFieldColumns() {
    const currentState = this.financialAccountsColumns$.getValue();

    if (Object.values(currentState)) {
      this.financialAccountsColumns$.next({
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
        modalidadeId: {
          col: 4,
        },
        contaRecebimentoId: {
          col: 4,
        },
        flagSplit: {
          col: 2,
        },
        flagTef: {
          col: 2,
        },
        diasCreditoConta: {
          col: 4,
        },
        melhorDiaCompra: {
          col: 4,
        },
        diaVencimento: {
          col: 4,
        },
      });
    }

    return;
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