import {
  Component,
  OnInit,
  ContentChild,
  TemplateRef,
  Input,
  ApplicationRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  Observable,
  debounceTime,
  withLatestFrom,
  filter,
  startWith,
  tap,
} from 'rxjs';
import { Entities } from 'src/app/store/entities/entities.namespace';

type EntityKey = keyof typeof Entities;

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListViewComponent implements OnInit {
  @ContentChild('header') header!: TemplateRef<unknown>;
  @ContentChild('body') body!: TemplateRef<unknown>;
  @Input('url') url!: string;
  @Input('entity') entity!: any;

  results$: Observable<any> = this.store.select(
    (state: any) => state[this.entity].results
  );

  fields$: Observable<any> = this.store.select(
    (state: any) => state[this.entity].fields
  );

  isLoading$: Observable<any> = this.store.select(
    (state: any) => state[this.entity].isLoading
  );

  filters$: Observable<any> = this.store.select(
    (state: any) => state[this.entity].filters
  );

  routeParams$: Observable<any> = this.activeRoute.queryParams;

  filters: FormGroup = new FormGroup({
    nomeoucpf: new FormControl(
      this.activeRoute.snapshot.queryParamMap.get('nomeoucpf')
    ),
    ativo: new FormControl(
      this.activeRoute.snapshot.queryParamMap.get('ativo')
    ),
  });

  constructor(
    private store: Store,
    private appRef: ApplicationRef,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        withLatestFrom(
          this.activeRoute.queryParams,
          this.filters$,
          this.filters.valueChanges.pipe(startWith({}))
        ),
        tap(() => {
          debugger;
        })
      )
      .subscribe(([event, params, state, filters, a]: any) => {
        const hasParams = !!Object.keys(params).length;

        debugger;

        if (hasParams) {
          this.filters.patchValue({ params }, { emitEvent: false });
          this.store.dispatch(new Entities['Patient'].SetEntityFilters(params));
          return;
        }

        if (!hasParams) {
          this.store.dispatch(new Entities['Patient'].SetEntityFilters({}));
          this.filters.setValue({}, { emitEvent: false });
        }
      });
  }

  ngOnInit(): void {
    this.filters.valueChanges.pipe(debounceTime(500)).subscribe((filters) => {
      const filteredFilters = Object.entries(filters).reduce(
        (acc: any, [key, value]: any) => {
          if (value !== '' && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      this.updateUrl(filteredFilters);
    });
  }

  get hasBodySlot(): boolean {
    return !!this.body;
  }

  get hasHeaderSlot(): boolean {
    return !!this.header;
  }

  // hasResults() {
  //   return !!(this.results$ || []);
  // }

  get renderHeaderSlot(): TemplateRef<unknown> {
    return this.header;
  }

  get renderBodySlot(): TemplateRef<unknown> {
    return this.body;
  }

  async handleFilter(event: any): Promise<void> {
    await this.router.navigate([], {
      queryParams: {
        ...this.filters.value,
      },
      relativeTo: this.activeRoute,
    });
  }

  clearFilters() {
    // this.router.navigate([], {
    //   //Trim blank spaces and set them to undefined || delete key
    //   queryParams: {},
    //   relativeTo: this.activeRoute,
    // });

    this.filters.patchValue({});

    //CREATE AN ACTION TO SET FILTERS
    // this.store.dispatch(new Entities['Patient'].PatchEntityFilters({}));
  }

  updateUrl(params: any) {
    // const queryParams = {
    //   nomeoucpf: this.filters.value.nomeoucpf,
    //   ativo: this.filters.value.ativo,
    // };

    debugger;

    if (Object.keys(params).length) {
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: params,
        queryParamsHandling: '',
      });

      return;
    }

    this.router.navigate([], { relativeTo: this.activeRoute, queryParams: {} });
  }
}
