import {
  combineLatest,
  first,
  iif,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  ApplicationRef,
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { Entities } from 'src/app/store/entities/entities.namespace';
import { FormValue, FormViewService } from './form-view.service';
import { ActivatedRoute } from '@angular/router';

type EntityKey = keyof typeof Entities;

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
})
export class FormViewComponent implements OnInit {
  @Input('entity') entity!: string;
  @Input('mode') mode: string | null = 'create';
  @Input('useActions') useActions: boolean = true;
  @ContentChild('header') header!: TemplateRef<unknown>;
  @ContentChild('body') body!: TemplateRef<unknown>;

  /** Probably is possible to prevent this observable to Run at createMode
   * once there`s no result do be displayed, but it needs to run at EditMode
   */
  result$: Observable<any> = this.store
    .select((state: any) => state[this.entity].results)
    .pipe(
      mergeMap((results) =>
        iif(
          () => this.isEditMode,
          of(results.find((result: any) => result.uuid === this.entityId)),
          of({})
        )
      )
    );

  fields$: Observable<any> = this.store.select(
    (state: any) => state[this.entity].fields
  );

  isLoading$: Observable<any> = this.store.select(
    (state: any) => state[this.entity].isLoading
  );

  entityId!: string;

  values: any = {};

  componentStore$: Observable<FormValue> = this.formService.formValues;

  onEditModeAction$!: Observable<any>;

  constructor(
    private store: Store,
    private appRef: ApplicationRef,
    private route: ActivatedRoute,
    private formService: FormViewService
  ) {}

  ngOnInit(): void {
    this.appRef.isStable
      .pipe(
        first((stable) => stable),
        switchMap(() => {
          return this.isCreateMode
            ? this.setUpCreateMode()
            : this.setUpEditMode();
        })
      )
      .subscribe();

    this.componentStore$.subscribe(({ fieldName, value }: FormValue) => {
      if (!fieldName && !value) {
        return {};
      }

      return (this.values = { ...this.values, [fieldName]: value });
    });

    this.onEditModeAction$ = combineLatest(
      this.result$,
      this.isLoading$,
      this.formService.formRefs
    ).pipe(
      first(([result, isLoading]) => !!result && !isLoading),
      map(([result, isLoading, forms]) => {
        forms.forEach((form) => {
          form.form.patchValue(result);
        });
      })
    );

    this.onEditModeAction$.subscribe();
  }

  ngOnDestroy() {}

  setUpCreateMode() {
    return this.store.dispatch(
      new Entities[this.entity as EntityKey].FetchAllEntities()
    );
  }

  setUpEditMode() {
    //TODO create an combineLatest to routeParams and user UUID
    return this.route.params.pipe(
      tap(({ id }) => (this.entityId = id)),
      map(({ id }) => id),
      switchMap((entityId) =>
        this.store.dispatch(
          new Entities[this.entity as EntityKey].FetchPatientById(entityId)
        )
      )
    );
  }

  get isEditMode() {
    return this.mode === 'edit';
  }

  get isCreateMode() {
    return this.mode === 'create';
  }

  get formStoreChange() {
    return this.formService;
  }

  get hasBodySlot(): boolean {
    return !!this.body;
  }

  get hasHeaderSlot(): boolean {
    return !!this.header;
  }

  get hasResults() {
    return !!(this.result$ || []);
  }

  onSaveChanges() {
    if (this.isCreateMode) {
      //TODO check all if forms are valid before submit
      this.store.dispatch(
        new Entities[this.entity as EntityKey].CreateEntity(this.values)
      );

      return;
    }

    if (this.isEditMode) {
      this.store.dispatch(
        new Entities[this.entity as EntityKey].PatchEntity({
          entityPayload: this.values,
          entityId: this.entityId,
        })
      );

      return;
    }
  }

  onCancel() {}

  renderHeaderSlot(): TemplateRef<unknown> {
    return this.header;
  }

  renderBodySlot(): TemplateRef<unknown> {
    return this.body;
  }
}
