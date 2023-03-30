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
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  Observable,
  first,
  tap,
  switchMap,
  combineLatest,
  distinctUntilChanged,
  debounceTime,
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

  filters!: FormGroup;

  onFirstLoad: Observable<any> = combineLatest([
    this.filters$,
    this.routeParams$,
    this.isLoading$,
  ]).pipe(
    first(([, , isLoading]) => !isLoading),
    tap(([filters, params]) => {
      this.store.dispatch(
        new Entities[this.entity as EntityKey].PatchEntityFilters({
          ...filters,
          ...params,
        })
      );
    })
  );

  constructor(
    private store: Store,
    private appRef: ApplicationRef,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.appRef.isStable
      .pipe(
        first((stable) => stable),
        switchMap(() => this.onFirstLoad)
      )
      .subscribe();

    // this.filters = new FormGroup({
    //   nomeoucpf: new FormControl(
    //     this.activeRoute.snapshot.queryParamMap.get('nomeoucpf')
    //   ),
    //   ativo: new FormControl(
    //     this.activeRoute.snapshot.queryParamMap.get('ativo')
    //   ),
    // });

    // this.filters.valueChanges.pipe(debounceTime(250)).subscribe((filters) => {
    //   const nonEmptyFilter = Object.entries(filters).reduce(
    //     (acc: { [key: string]: any }, [key, value]) => {
    //       if (value) {
    //         acc[key] = value;
    //       }
    //       return acc;
    //     },
    //     {}
    //   );

    //   this.updateUrl();

    //   this.store.dispatch(
    //     new Entities['Patient'].PatchEntityFilters(nonEmptyFilter)
    //   );
    // });
  }

  ngOnInit(): void {}

  ngOnChanges() {}

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

  updateUrl() {
    const queryParams = {
      nomeoucpf: this.filters.value.nomeoucpf,
      ativo: this.filters.value.ativo,
    };

    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
