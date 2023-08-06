import { FinancialAccount } from './../../../interfaces/financial-accounts.interface';
import { AutocompleteOption } from 'src/app/components/autocomplete/multiselect-autocomplete.interface';
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
  iif,
  of,
  catchError,
  tap,
  withLatestFrom,
  debounceTime,
  concatMap,
  first,
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
  ETextAccountReceiveForms,
  IFinancialAccountFromApi,
  IFinancialAccountsForReceipt,
  IFormsOfSettlementFromApi,
} from 'src/app/interfaces';
import { FieldsConfig, FieldsArrayName, FieldConfig } from 'src/app/models';
import { FinancialAccountsService } from 'src/app/services/financial-accounts.service';
import { ActivatedRoute } from '@angular/router';

/** TODO
 *
 * Form need to update its value when fields change.
 * Dynamic forms are accumulating previous forms fields due its non-reactivity
 *
 */

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
    new BehaviorSubject<FinancialAccountValidators>({});

  financialAccountsAttributes$ =
    new BehaviorSubject<FinancialAccountAttributes>({
      contaLiquidacao: {
        multiple: true,
      },
      tipoContaId: {
        hideRequiredMarker: true,
        // disabled: true,
      },
      unidadeId: {
        // disabled: true,
      },
    });

  financialAccountsFields$ = new BehaviorSubject<FinancialAccountFields>({});

  hasLoadedUnityOptions$ = this.financialAccountsFields$.pipe(
    distinctUntilChanged(),
    filter((fields) => !!fields.unidadeId?.options?.length),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  //FormEvents
  accountTypeIsPhysicalBox$!: Observable<boolean>;
  accountTypeIsBank$!: Observable<boolean>;
  accountTypeIsCard$!: Observable<boolean>;

  isModalityCreditPayments$!: Observable<boolean>;
  isModalityCreditReceipts$!: Observable<boolean>;
  isModalityDebitReceipts$!: Observable<boolean>;

  //Refactor from here
  financialAccount$ = new BehaviorSubject<IFinancialAccountFromApi>(
    {} as IFinancialAccountFromApi
  );

  //Combos
  accountTypes$!: Observable<AutocompleteOption[]>;
  bankAccounts$!: Observable<AutocompleteOption[]>;
  paymentsModalities$!: Observable<AutocompleteOption[]>;
  currentLoggedClinic$!: Observable<AutocompleteOption[]>;
  accountsFormReceipts$!: Observable<AutocompleteOption[]>;
  formReceipts$!: Observable<
    { label: ETextAccountReceiveForms; value: string | number }[]
  >;

  allComboBoxHaveBeenLoaded!: Observable<boolean>;

  private subscriptionsSink$ = new Subscription();
  private destroy$ = new Subject();

  isEditMode$!: Observable<boolean>;
  isCreateMode$!: Observable<boolean>;

  vm$!: Observable<any>;

  constructor(
    private financialAccountService: FinancialAccountsService,
    private cdRef: ChangeDetectorRef,
    public formService: FormViewService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setUpFormFields();
    this.setUpFormValidators();
    this.setUpFormFieldColumns();
    this.setUpFormAttributes();

    //Fetch field config

    this.getFinancialAccountsFields();
    //Set up fields for each service

    //Fetch comboboxes
    this.getCurrentClinic2();
    this.getAccountTypes2();
    this.getFormReceipts();
    this.getBankAccounts();
    this.getPaymentModalities();
    this.getAccountsFormReceipts();

    this.formValuesSubscription$ = this.formService.formValues.subscribe(
      (values) => (this.formValues = values)
    );

    this.isEditMode$ = this.route.url.pipe(
      map((url) => url[url.length - 1].path === 'edit')
    );

    this.isCreateMode$ = this.route.url.pipe(
      map((url) => url[url.length - 1].path === 'new')
    );

    this.isCreateMode$
      .pipe(
        switchMap(() => this.fetchAllCombos()),
        withLatestFrom(this.financialAccountsFields$),
        tap(([combos, fields]) => {
          const f = Object.values(fields).reduce(
            (
              acc: FieldsConfig<FinancialAccount>,
              curr: FieldConfig<FinancialAccount>
            ) => {
              const v = acc;
              const c = curr;
              const cc = combos[curr.name] as FieldConfig<any>;

              if (!cc)
                return {
                  ...acc,
                  [curr.name]: { ...curr },
                };

              return {
                ...acc,
                [curr.name]: { ...curr, options: cc },
              };
            },
            {} as FieldsConfig<FinancialAccount>
          );

          debugger;
          this.financialAccountsFields$.next(f);
        })
      )
      .subscribe();

    this.isEditMode$.subscribe(() => {
      //do logic here
    });

    // computed
    this.isAccountTypeCard();
    this.isAccountTypePhysical();
    this.isAccountTypeBank();
    this.isModalityCreditPayments();
    this.isModalityCreditReceipts();
    this.isModalityDebitReceipts();

    this.watchAccountTypeValuePhysicalAndEnableFields();
    this.watchAccountTypeValueBankAndEnableFields();

    this.watchAccountTypeValueCardAndEnableFields();
    this.watchAccountTypeValueCardAndFetchAccountsFormReceipts();

    this.watchAccountModalityCreditPaymentsAndEnableFields();
    this.watchAccountModalityCreditReceiptsAndEnableFields();
    this.watchAccountModalityDebitReceiptsAndEnableFields();
  }

  ngOnDestroy(): void {
    this.subscriptionsSink$.unsubscribe();
  }

  startEditFlow(): Observable<any> {
    return this.financialAccountService
      .getFinancialAccountById(+this.route.snapshot.paramMap.get('id')!! ?? 223)
      .pipe(
        map((v) => ({
          ...v,
          contaLiquidacao: v['contaLiquidacao'].map(
            (i: any) => i.formaLiquidacaoId
          ),
        })),
        tap((v) => this.financialAccount$.next(v)),
        switchMap(() => {
          return combineLatest({
            fields: this.fetchAllCombos().pipe(
              withLatestFrom(this.financialAccountsFields$),
              map(([combos, fields]) => {
                const f = Object.values(fields).reduce(
                  (
                    acc: FieldConfig<FinancialAccount>,
                    curr: FieldConfig<FinancialAccount>
                  ) => {
                    const v = acc;
                    const c = curr;
                    const cc = combos[curr.name] as FieldConfig<any>;

                    if (!cc)
                      return {
                        ...acc,
                        [curr.name]: { ...curr },
                      };

                    return {
                      ...acc,
                      [curr.name]: { ...curr, options: cc },
                    };
                  },
                  {} as FieldConfig<FinancialAccount>
                );

                debugger;
                return f;
              })
            ),
            validators: this.financialAccountsValidators$,
            columns: this.financialAccountsColumns$,
            attributes: this.financialAccountsAttributes$,
          });
        })
      );
  }

  startCreateFlow(): Observable<any> {
    return combineLatest({
      fields: this.fetchAllCombos().pipe(
        withLatestFrom(this.financialAccountsFields$),
        map(([combos, fields]) => {
          const f = Object.values(fields).reduce(
            (
              acc: FieldConfig<FinancialAccount>,
              curr: FieldConfig<FinancialAccount>
            ) => {
              const v = acc;
              const c = curr;
              const cc = combos[curr.name] as FieldConfig<any>;

              if (!cc)
                return {
                  ...acc,
                  [curr.name]: { ...curr },
                };

              return {
                ...acc,
                [curr.name]: { ...curr, options: cc },
              };
            },
            {} as FieldConfig<FinancialAccount>
          );

          debugger;
          return f;
        })
      ),
      validators: this.financialAccountsValidators$,
      columns: this.financialAccountsColumns$,
      attributes: this.financialAccountsAttributes$,
    });
  }

  fetchAllCombos(): Observable<Record<string, unknown>> {
    return combineLatest({
      unidadeId: this.currentLoggedClinic$.pipe(this.onFetchComboBoxError()),
      tipoContaId: this.accountTypes$.pipe(this.onFetchComboBoxError()),
      modalidadeId: this.paymentsModalities$.pipe(this.onFetchComboBoxError()),
      bancoId: this.bankAccounts$.pipe(this.onFetchComboBoxError()),
      contaLiquidacao: this.formReceipts$.pipe(this.onFetchComboBoxError()),
    });
  }

  getFormReceipts() {
    this.formReceipts$ = this.financialAccountService
      .listFormsOfSettlement()
      .pipe(
        map((formSettlements) =>
          formSettlements
            .map((formSettlement) => ({
              label: formSettlement.formaLiquidacao,
              value: formSettlement.id,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label))
        )
      );
  }

  getAccountTypes2() {
    this.accountTypes$ = this.financialAccountService
      .getCurrentAccountsRelatedTypes()
      .pipe(
        map((accTypes) =>
          accTypes
            .map((accountType) => ({
              label: accountType.tipoContaCorrente,
              value: accountType.id,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label))
        )
      );
  }

  getBankAccounts() {
    this.bankAccounts$ = this.financialAccountService
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
  }

  getPaymentModalities() {
    this.paymentsModalities$ = this.financialAccountService
      .listModalities()
      .pipe(
        map((modalities) =>
          modalities
            .map((modality) => ({
              label: modality.modalidade,
              value: modality.id,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label))
        )
      );
  }

  getAccountsFormReceipts() {
    this.accountsFormReceipts$ = this.financialAccountService
      .listAccountsForReceipt({
        unidadeId: this.formValues['unidadeId'] || 183,
        tipoContaId:
          this.formValues['tipoContaId'] ||
          this.financialAccount$.getValue().tipoContaId,
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
  }

  getCurrentClinic2() {
    this.currentLoggedClinic$ = this.financialAccountService.getCurrentClinic();
  }

  //Refacatore Above

  onFetchComboBoxError() {
    return catchError((error) => {
      console.log(error);
      return of([]);
    });
  }

  isAccountTypePhysical() {
    this.accountTypeIsPhysicalBox$ = this.formService.formValues.pipe(
      filter((formValues) => formValues['tipoContaId']),
      map((formValues) => formValues['tipoContaId']),
      map((fieldValue) => fieldValue === +EFinancialAccountType.CAIXA_FISICO),
      filter((isPhysicalBox) => isPhysicalBox)
      // distinctUntilChanged()
    );
  }

  isAccountTypeBank() {
    this.accountTypeIsBank$ = this.formService.formValues.pipe(
      filter((formValues) => formValues['tipoContaId']),
      map((formValues) => formValues['tipoContaId']),
      map((fieldValue) => fieldValue === +EFinancialAccountType.CONTA_BANCARIA),
      filter((isBank) => isBank)
      // distinctUntilChanged()
    );
  }

  isAccountTypeCard() {
    this.accountTypeIsCard$ = this.formService.formValues.pipe(
      filter((formValues) => formValues['tipoContaId']),
      map((formValues) => formValues['tipoContaId']),
      map((fieldValue) => fieldValue === +EFinancialAccountType.CARTAO),
      filter((isCard) => isCard)
      // distinctUntilChanged()
    );
  }

  isModalityCreditPayments() {
    this.isModalityCreditPayments$ = this.formService.formValues.pipe(
      filter(
        (formValues) => formValues['modalidadeId'] && formValues['tipoContaId']
      ),
      map((formValues) => ({
        modalidadeId: formValues['modalidadeId'],
        tipoContaId: formValues['tipoContaId'],
      })),
      map(({ modalidadeId, tipoContaId }) => {
        return (
          modalidadeId === +EFinancialAccountModality.CC_PAGAMENTO &&
          tipoContaId === 3
        );
      }),
      filter((isModalityCredit) => isModalityCredit)
    );
  }

  isModalityCreditReceipts() {
    this.isModalityCreditReceipts$ = this.formService.formValues.pipe(
      filter(
        (formValues) => formValues['modalidadeId'] && formValues['tipoContaId']
      ),
      map((formValues) => ({
        modalidadeId: formValues['modalidadeId'],
        tipoContaId: formValues['tipoContaId'],
      })),
      map(
        ({ modalidadeId, tipoContaId }) =>
          modalidadeId === +EFinancialAccountModality.CC_RECEBIMENTO &&
          tipoContaId === 3
      ),
      filter((isModalityCreditReceipts) => isModalityCreditReceipts)
    );
  }

  isModalityDebitReceipts() {
    this.isModalityDebitReceipts$ = this.formService.formValues.pipe(
      filter(
        (formValues) => formValues['modalidadeId'] && formValues['tipoContaId']
      ),
      map((formValues) => ({
        modalidadeId: formValues['modalidadeId'],
        tipoContaId: formValues['tipoContaId'],
      })),
      map(
        ({ modalidadeId, tipoContaId }) =>
          modalidadeId === +EFinancialAccountModality.CD_RECEBIMENTO &&
          tipoContaId === 3
      ),
      filter((isModalityDebitReceipts) => isModalityDebitReceipts)
    );
  }

  getFinancialAccountsFields() {
    this.financialAccountService
      .getFields()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fields) => this.financialAccountsFields$.next(fields));
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

  watchAccountTypeValueCardAndFetchAccountsFormReceipts() {
    this.accountTypeIsCard$
      .pipe(
        tap((v) => console.log({ v })),
        distinctUntilChanged(), //ACTING LIKE A first() operator by watching the previous computed emitting true several times
        // first(),
        takeUntil(this.destroy$),
        // debounceTime(500), // Verify if need for edit mode
        concatMap(() => {
          return this.financialAccountService
            .listAccountsForReceipt({
              unidadeId: this.formValues['unidadeId'] || 183,
              tipoContaId: 2 || this.formValues['tipoContaId'],
            })
            .pipe(
              map((accounts) =>
                accounts
                  .map((account) => ({
                    label: account.banco,
                    value: account.id,
                  }))
                  .sort((a: any, b: any) => a.label.localeCompare(b.label))
              ),

              catchError((err) => {
                console.log(err);

                return of([]);
              })
            );
        })
      )
      .subscribe((accounts) => {
        const currentState = this.financialAccountsFields$.getValue();

        if (currentState.contaRecebimentoId) {
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
          'diaVencimento',
          'melhorDiaCompra',
          'diasCreditoConta',
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
          'contaRecebimentoId',
          'flagTef',
          'flagSplit',
          'diasCreditoConta',
          'contaLiquidacao',
          // 'diasCreditoConta',
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
          'contaRecebimentoId',
          'flagTef',
          'flagSplit',
          'diasCreditoConta',
          'contaLiquidacao',
        ]);
      });

    this.subscriptionsSink$.add(loadModalityDebitReceiptsFieldsSubs$);
  }

  setUpFormFieldColumns() {
    this.financialAccountsColumns$.next({
      unidadeId: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      tipoContaId: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      nome: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      contaLiquidacao: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      bancoId: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      agencia: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      numero: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      titulo: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      documento: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      modalidadeId: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      contaRecebimentoId: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      flagSplit: {
        col: 2,
      },
      flagTef: {
        col: 2,
      },
      diasCreditoConta: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      melhorDiaCompra: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      diaVencimento: {
        lg: 4,
        md: 6,
        sm: 12,
      },
    });

    return;
  }

  setUpFormFields() {}

  setUpFormAttributes() {}

  setUpFormValidators() {}

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
