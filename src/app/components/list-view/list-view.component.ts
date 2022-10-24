import {
  Component,
  OnInit,
  ContentChild,
  TemplateRef,
  Input,
  ApplicationRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, first, tap, switchMap, combineLatest } from 'rxjs';
import { Entities } from 'src/app/store/entities/entities.namespace';

type EntityKey = keyof typeof Entities;

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
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
}
