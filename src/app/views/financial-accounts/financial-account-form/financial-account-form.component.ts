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
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  combineLatest,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  shareReplay,
  takeUntil,
  tap,
} from 'rxjs';
import { FormViewService } from 'src/app/components/form-view/form-view.service';
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
  });

  financialAccountsValidators$ =
    new BehaviorSubject<FinancialAccountValidators>({
      unidadeId: [Validators.nullValidator],
    });

  financialAccountsAttributes$ =
    new BehaviorSubject<FinancialAccountAttributes>({});

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

  constructor(
    private financialAccountService: FinancialAccountsService,
    private cdRef: ChangeDetectorRef,
    public formService: FormViewService
  ) {}

  ngOnInit(): void {
    this.getFinancialAccountsFields();
    this.getCurrentClinic();
    this.setUnityFieldDisabled();
    this.getAccountTypes();
  }

  ngOnDestroy(): void {
    this.fieldsSubscription$ && this.fieldsSubscription$.unsubscribe();
    this.disableUnityFormField$ && this.disableUnityFormField$.unsubscribe();
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

  getAccountTypes() {}

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
