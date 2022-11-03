import { map, tap, BehaviorSubject, of, combineLatest, filter } from 'rxjs';
import { Observable, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import {
  FloatLabelType,
  MatFormFieldAppearance,
} from '@angular/material/form-field';
import { AutocompleteOption } from './multiselect-autocomplete.interface';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit {
  @Input() placeholder!: string;
  @Input() appearance: MatFormFieldAppearance = 'fill';
  @Input() floatingLabel: FloatLabelType = 'always';
  @Input() selectAllOption: boolean = true;

  @Input('data') set newData(incomingData: AutocompleteOption[] | null) {
    // Rethink this function, its working fine but not optimized
    if (!!incomingData?.length) {
      const hasDifference = this.symmetricDifference(
        new Set([...this.data.map((option) => option.value)]),
        new Set([...incomingData.map((option) => option.value)])
      );

      if (hasDifference) {
        let filteredDataToAdd = incomingData.filter((option) =>
          [...hasDifference].find((id) => option.value === id)
        );
        this.data = [...this.data, ...filteredDataToAdd];
        this.currentOptions$.next(this.data);
      }

      if (this.lastSearchValue) {
        this.searchControl.setValue(this.lastSearchValue);
      }

      return;
    }

    this.data = [];
  }

  data: AutocompleteOption[] = [];

  @Output() selectedOptions = new EventEmitter<
    Observable<AutocompleteOption[]>
  >();

  @Output() userSearchToApi = new EventEmitter<Observable<string>>();

  filteredOptionsByUser$!: Observable<AutocompleteOption[]>;
  searchControl: FormControl = new FormControl('');
  lastSearchValue: string | null = null;
  isLoading: boolean = false;

  currentOptions$ = new BehaviorSubject<AutocompleteOption[]>([]);

  currentSelectedOptions$ = new BehaviorSubject<AutocompleteOption[]>([]);

  uniqueSelectedDataIds: Set<string | number> = new Set();

  allSelected$: Observable<boolean> = this.onSelectChange();

  searchNotFound: boolean = false;

  emittedUserSearch: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        filter((searchControlValue) => searchControlValue),
        tap((searchControlValue) => {
          this.isLoading = true;
          this.lastSearchValue = searchControlValue;
          this.searchNotFound = false;
        }),
        startWith(''),
        map((searchControlValue) => {
          const search =
            typeof searchControlValue === 'string'
              ? searchControlValue
              : searchControlValue.label;

          if (searchControlValue === '') return this.data;

          return search ? this._filter(search as string) : this.data;
        }),

        tap((currentOptions) => {
          currentOptions = currentOptions.map((option: AutocompleteOption) => ({
            ...option,
            selected: this.currentSelectedDataIds.includes(option.value),
          }));

          this.currentOptions$.next(currentOptions);
          this.isLoading = false;
        }),
        tap((currentOptions) => {
          if (this.lastSearchValue === null) {
            this.isLoading = false;
            return;
          }

          //* This not working as intended must rethink
          if (this.lastSearchValue && !currentOptions.length) {
            this.isLoading = true;

            if (!this.emittedUserSearch) {
              this.userSearchToApi.next(of(this.lastSearchValue));
              this.emittedUserSearch = true;
              this.searchNotFound = true;

              return;
            }

            this.emittedUserSearch = false;
            this.isLoading = false;
            this.searchNotFound = true;
          }
          return;
        })
      )
      .subscribe();
  }

  get currentOptionsIds(): Array<number | string> {
    return this.currentOptions$.value.map(
      (option: AutocompleteOption) => option.value
    );
  }

  get currentSelectedDataIds(): Array<number | string> {
    return this.currentSelectedOptions$.value.map(
      (option: AutocompleteOption) => option.value
    );
  }

  //Warning: edit mode maybe dont have those IDs at data
  get updatedOptionsToEmit(): AutocompleteOption[] {
    const allSelected = this.data?.filter((option: any) =>
      [...this.uniqueSelectedDataIds].find(
        (selectedId) => selectedId === option.value
      )
    );

    return allSelected.map((option: AutocompleteOption) => ({
      ...option,
      selected: true,
    }));
  }

  get updatedCurrentOptionsToEmit(): AutocompleteOption[] {
    return this.currentOptions$
      .getValue()
      .map((option: AutocompleteOption) => ({
        ...option,
        selected: this.currentSelectedDataIds.includes(option.value),
      }));
  }

  get selectedAllFalse(): AutocompleteOption[] {
    return this.data?.map((option: AutocompleteOption) => ({
      ...option,
      selected: false,
    }));
  }

  //Delete
  get currentSelectedIdsHTML(): string {
    return this.currentSelectedDataIds.map((v) => v).join(',');
  }

  onSelectChange(): Observable<boolean> {
    return combineLatest([
      this.currentSelectedOptions$,
      this.currentOptions$,
    ]).pipe(
      map(([currentSelectedOptions, _]) => {
        if (!currentSelectedOptions.length) {
          return false;
        }

        return this.isSuperset(
          new Set(...[this.currentSelectedDataIds]),
          new Set(...[this.currentOptionsIds])
        );
      })
    );
  }

  ngOnChanges() {}

  private _filter(label: string): AutocompleteOption[] {
    const filterValue = label.toLowerCase();

    return this.data.filter((option: any) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  trackBy(index: number, item: AutocompleteOption) {
    return item.value;
  }

  onAddOption(optionId: string | number) {
    if (this.uniqueSelectedDataIds.has(optionId)) {
      this.uniqueSelectedDataIds.delete(optionId);

      this.currentSelectedOptions$.next([...this.updatedOptionsToEmit]);

      //Event Emitter
      this.selectedOptions.next(this.currentSelectedOptions$.asObservable());

      this.currentOptions$.next([
        ...this.currentOptions$.getValue().map((option) => ({
          ...option,
          selected: this.currentSelectedDataIds.includes(option.value),
        })),
      ]);

      return;
    }

    //Always update the Set of IDs
    this.uniqueSelectedDataIds.add(optionId);

    this.currentSelectedOptions$.next([...this.updatedOptionsToEmit]);

    //Event Emitter
    this.selectedOptions.next(this.currentSelectedOptions$.asObservable());

    this.currentOptions$.next([
      ...this.currentOptions$.getValue().map((option) => ({
        ...option,
        selected: this.currentSelectedDataIds.includes(option.value),
      })),
    ]);

    return;
  }

  onSelectAll() {
    let newUniqueIds = this.symmetricDifference(
      new Set(...[this.currentOptionsIds]),
      this.uniqueSelectedDataIds
    );

    const allSelected = this.currentOptions$
      .getValue()
      .every((option) => this.currentSelectedDataIds.includes(option.value));

    if (newUniqueIds.size === 0) {
      this.data.map((option) => ({
        ...option,
        selected: this.currentSelectedDataIds.includes(option.value),
      }));

      //Added merged selected Options
      this.currentSelectedOptions$.next([]);

      //Update currentOptions as selected
      this.currentOptions$.next([
        ...this.currentOptions$.getValue().map((option) => {
          if (option.selected) delete option.selected;

          return option;
        }),
      ]);

      //Event Emitter
      this.selectedOptions.next(of([]));

      this.uniqueSelectedDataIds = newUniqueIds;
    } else {
      if (!allSelected)
        this.uniqueSelectedDataIds = new Set([
          ...this.uniqueSelectedDataIds,
          ...newUniqueIds,
        ]);

      //Added merged selected Options
      this.currentSelectedOptions$.next([...this.updatedOptionsToEmit]);

      //Update currentOptions as selected
      this.currentOptions$.next([...this.updatedOptionsToEmit]);

      //Event Emitter
      this.selectedOptions.next(this.currentSelectedOptions$.asObservable());
    }
  }

  symmetricDifference(setA: Set<number | string>, setB: Set<number | string>) {
    const difference = new Set(setA);

    for (const elem of setB) {
      if (difference.has(elem)) {
        difference.delete(elem);
      } else {
        difference.add(elem);
      }
    }

    return difference;
  }

  isSuperset(set: Set<number | string>, subset: Set<number | string>) {
    for (const elem of subset) {
      if (!set.has(elem)) {
        return false;
      }
    }

    return true;
  }
}
