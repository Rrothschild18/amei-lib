import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormViewService } from 'src/app/components/form-view/form-view.service';
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
      // tipoContaId: [],
    });

  financialAccountsAttributes$ =
    new BehaviorSubject<FinancialAccountAttributes>({});

  fieldsSubscription$!: Subscription;

  financialAccountsFields$ = new BehaviorSubject<FinancialAccountFields>({});

  constructor(private financialAccountService: FinancialAccountsService) {}

  ngOnInit(): void {
    this.getFinancialAccountsFields();
  }

  ngOnDestroy(): void {
    this.fieldsSubscription$ && this.fieldsSubscription$.unsubscribe();
  }

  getFinancialAccountsFields() {
    this.fieldsSubscription$ = this.financialAccountService
      .getFields()
      .subscribe((fields) => this.financialAccountsFields$.next(fields));
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
