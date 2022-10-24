import {
  debounceTime,
  distinctUntilChanged,
  last,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Entities } from 'src/app/store/entities/entities.namespace';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
})
export class PatientsListComponent implements OnInit {
  displayedColumns!: string[];

  filters: FormGroup = new FormGroup({
    nomeoucpf: new FormControl(''),
    ativo: new FormControl(''),
  });

  filters$: Observable<any> = this.store.select(
    (state: any) => state['Patient'].filters
  );

  searchNameValue$: Observable<string> | undefined;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.searchNameValue$ = this.filters.get('nomeoucpf')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      //Ill need another stream here to emit last value from params to patch filters at store
      switchMap((value) =>
        this.activeRoute.queryParams.pipe(
          tap((params) => {
            debugger;
            console.log(params);
          }),
          tap((filters) => {
            this.router.navigate([], {
              //Trim blank spaces and set them to undefined || delete key
              queryParams: {
                ...filters,
                nomeoucpf: value,
              },
              relativeTo: this.activeRoute,
            });
          }),

          //Resolver infinte loop here. Find a update strategy
          tap((params) => {
            this.store.dispatch(
              new Entities['Patient'].PatchEntityFilters(params)
            );
          }),

          map(() => value)
        )
      ),
      map((value) => value || '')
    );
  }

  fetchSuccess(payload: any): void {
    this.displayedColumns = Object.keys(payload.fields);
  }

  toArrayFields(fields: any = {}): string[] {
    console.log(Object.keys(fields));
    return ['name', 'lastName', 'document', 'email', 'phone'];
  }

  patientColumns(): string[] {
    return ['name', 'lastName', 'document', 'email', 'phone', 'actions'];
  }

  redirectToEdit(uuid: string): void {
    this.router.navigate([`/patients/${uuid}/edit`]);
  }

  handleFilter(event: any): void {
    this.router.navigate([], {
      queryParams: {
        ...this.filters.value,
      },
      relativeTo: this.activeRoute,
    });

    // debugger;

    this.store.dispatch(
      new Entities['Patient'].PatchEntityFilters(this.filters.value)
    );
  }

  clearFilters() {
    this.router.navigate([], {
      //Trim blank spaces and set them to undefined || delete key
      queryParams: {},
      relativeTo: this.activeRoute,
    });

    //CREATE AN ACTION TO SET FILTERS
    // this.store.dispatch(new Entities['Patient'].PatchEntityFilters({}));
  }
}
