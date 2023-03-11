import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatFormFieldAppearance,
  FloatLabelType,
} from '@angular/material/form-field';
import {
  of,
  Observable,
  BehaviorSubject,
  startWith,
  tap,
  debounceTime,
  map,
  combineLatest,
  shareReplay,
} from 'rxjs';
import {
  AutocompleteConfig,
  AutocompleteOption,
} from './multiselect-autocomplete.interface';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit {
  @Input() placeholder!: string;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() floatingLabel: FloatLabelType = 'auto';
  @Input() multiple: boolean = true;
  @Input() cacheData: boolean = true;
  @Input() cacheSelectData: boolean = true;
  @Input() selectAllOption: boolean = true;

  @Input('selectedData') set onSelectedData(data: AutocompleteOption[] | null) {
    const hasData = !!data?.length;
    const currData = this.data$.getValue();
    let dataToAdd: AutocompleteConfig = {};
    this.selectedData$.next(data || []);

    if (data && hasData) {
      if (this.cacheSelectData) {
        data?.forEach((option) => {
          const dataOptionNotExists = !currData[option.value];

          if (dataOptionNotExists) {
            dataToAdd[option.value] = option;
            dataToAdd[option.value].selected = true;
          } else {
            dataToAdd[option.value] = option;
            dataToAdd[option.value].selected = true;
          }
        });
        this.data$.next({ ...currData, ...dataToAdd });
      } else {
        Object.values(currData).forEach(
          (option) => (currData[option.value].selected = false)
        );

        data.forEach((option) => {
          const existAtCurrentData = !!currData[option.value];

          if (existAtCurrentData) {
            currData[option.value] = option;
            currData[option.value].selected = true;
          }
        });

        this.data$.next(currData);
      }

      // this.selectedOptions.emit(of(this.currentSelectedOptionsEmit));

      return;
    }
  }

  @Input('data') set newData(incomingData: AutocompleteOption[] | null) {
    let dataToAdd: AutocompleteConfig = {};
    const hasIncomingData = !!incomingData?.length;
    const noCurrentOptions = !Object.keys(this.currentOptions$.getValue())
      .length;
    const currData = this.data$.getValue();
    const hasCurrValues = Object.keys(currData).length;
    const currentSelectedDataFromParent = this.selectedData$.getValue();
    const hasCurrentSelectedDataFromParent =
      !!this.selectedData$.getValue().length;

    if (hasIncomingData) {
      if (this.cacheData) {
        this.cacheIncomingData(incomingData);
      } else {
        dataToAdd = this.transformToConfig(incomingData);

        if (noCurrentOptions && this.emittedUserSearch) {
          this.isLoading$.next(false);
          this.emittedUserSearch = false;
        }

        if (noCurrentOptions && !this.emittedUserSearch) {
          this.isLoading$.next(true);
          this.emittedUserSearch = true;
        }

        const incomingAsConfig = this.transformToConfig(incomingData);

        if (hasCurrValues) {
          Object.entries(currData).forEach(([key, option]) => {
            const existsAtIncoming = !!incomingAsConfig[+key];
            const isSelectedPreviously = !!option?.selected;

            if (existsAtIncoming && isSelectedPreviously && !this.multiple) {
              dataToAdd[+key] = option;
              dataToAdd[+key].selected = true;
            }
          });
        }

        if (hasCurrentSelectedDataFromParent) {
          const previousSelected = this.transformToConfig(
            currentSelectedDataFromParent
          );

          Object.entries(previousSelected).forEach(([key, option]) => {
            const existsAtIncoming = !!incomingAsConfig[+key];

            if (existsAtIncoming) {
              dataToAdd[+key] = option;
              dataToAdd[+key].selected = true;
            }
          });
        }

        this.data$.next({ ...dataToAdd });
      }

      return;
    }

    if (!this.cacheData) {
      this.data$.next({});
      this.emittedUserSearch = true;
    }
    // this.selectedOptions.emit(of(this.currentSelectedOptionsEmit));
    this.isLoading$.next(false);
  }

  @Output() selectedOptions = new EventEmitter<
    Observable<AutocompleteOption[]>
  >();

  @Output() userSearchToApi = new EventEmitter<Observable<string>>();

  searchControl: FormControl = new FormControl('');

  data$ = new BehaviorSubject<AutocompleteConfig>({});
  selectedData$ = new BehaviorSubject<AutocompleteOption[]>([]);

  private currentOptions$ = new BehaviorSubject<AutocompleteConfig>({});
  currentOptions$$: Observable<AutocompleteConfig> = this.setUpCurrentOptions();

  lastSearchValue: string | null = null;

  isLoading$ = new BehaviorSubject<boolean>(true);

  allSelected$: Observable<BooleanInput> = this.calculateSets();
  emittedUserSearch: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  //Debugging
  get currentSelectedIdsHTML$(): Observable<string> {
    return this.currentSelectedOptions$.pipe(
      map((options) => {
        return Object.values(options)
          .map((v) => v.value)
          .join(',');
      })
    );
  }

  get currentSelected(): AutocompleteConfig {
    const selectedOptions: AutocompleteOption[] = Object.values(
      this.data$
    ).filter(({ selected }) => selected);

    let transformedOptions = this.transformToConfig(selectedOptions);

    return transformedOptions;
  }

  get currentSelectedOptions$(): Observable<AutocompleteConfig> {
    return this.data$.asObservable().pipe(
      map((currentData) => {
        const selectedOptions = Object.values(currentData).filter(
          (option: AutocompleteOption) => option.selected
        );

        return this.transformToConfig(selectedOptions);
      })
    );
  }

  get currentSelectedOptionsEmit(): AutocompleteOption[] {
    const currentData = this.data$.getValue();

    const selectedOptions = Object.values(currentData)
      .filter((option: AutocompleteOption) => option.selected)
      .map((option) => ({
        label: option.label,
        value: option.value,
      }));

    return selectedOptions;
  }

  get hasMoreThanOneOption$(): Observable<boolean> {
    return this.currentOptions$.pipe(
      map((options) => Object.keys(options).length > 1 && this.multiple)
    );
  }

  get searchNotFound$(): Observable<boolean> {
    return this.currentOptions$.pipe(
      map(
        (options) =>
          Object.keys(options).length === 0 && !this.isLoading$.getValue()
      )
    );
  }

  private _filter(
    label: string,
    data: AutocompleteConfig = {}
  ): AutocompleteConfig {
    const filterValue = label.toLowerCase();

    const filteredIds = Object.values(data)
      .filter((option: any) => option.label.toLowerCase().includes(filterValue))
      .map((option) => option.value);

    let filteredData: AutocompleteConfig = {};

    filteredIds.forEach(
      (optionId) => (filteredData[optionId] = data[optionId])
    );

    return filteredData;
  }

  trackByFn(option: any, option2: any) {
    return option2['key'];
  }

  toggleOption(optionId: string | number) {
    let currData = this.data$.getValue();
    const currentAlreadySelected = currData[optionId].selected;
    const currentNotSelected = !currData[optionId].selected;

    if (this.multiple) {
      if (currentNotSelected) {
        currData = {
          ...currData,
          [optionId]: { ...currData[optionId], selected: true },
        };
      }

      if (currentAlreadySelected) {
        currData = {
          ...currData,
          [optionId]: { ...currData[optionId], selected: false },
        };
      }
    }

    if (!this.multiple) {
      if (currentNotSelected) {
        Object.values(currData).forEach((option) => {
          let optionId = option.value;

          currData[optionId] = {
            ...option,
            selected: false,
          };
        });

        currData[optionId].selected = true;
      }

      if (currentAlreadySelected) {
        Object.values(currData).forEach((option) => {
          let optionId = option.value;

          currData[optionId] = {
            ...option,
            selected: false,
          };
        });

        currData[optionId].selected = false;
      }
    }

    this.data$.next(currData);
    this.selectedOptions.emit(of(this.currentSelectedOptionsEmit));
  }

  onSelectAll() {
    const currentData = this.data$.getValue();
    const currentOptions = this.currentOptions$.getValue();
    const currentSelectedOptions = this.transformToConfig(
      Object.values(currentData).filter(
        (option: AutocompleteOption) => option.selected
      )
    );
    const allSelected = this.isSuperset(
      new Set(Object.keys(currentSelectedOptions)),
      new Set(Object.keys(currentOptions))
    );

    const dataToUpdate: AutocompleteConfig = {};

    /**
     * Case 1 - All current data is selected
     */
    if (allSelected) {
      Object.values(currentOptions).forEach((option) => {
        dataToUpdate[option.value] = option;
        dataToUpdate[option.value].selected = false;
      });

      this.data$.next({
        ...currentData,
        ...dataToUpdate,
      });
    }

    /**
     * Case 2 - All current data is not selected
     */

    if (!allSelected) {
      Object.keys(currentOptions).forEach((value) => {
        dataToUpdate[value] = currentOptions[value];
        dataToUpdate[value].selected = true;
      });

      this.data$.next({
        ...currentData,
        ...dataToUpdate,
      });
    }

    this.selectedOptions.emit(of(this.currentSelectedOptionsEmit));
  }

  isSuperset(set: Set<number | string>, subset: Set<number | string>): boolean {
    for (const elem of subset) {
      if (!set.has(elem)) {
        return false;
      }
    }

    return true;
  }

  private calculateSets(): Observable<BooleanInput> {
    return combineLatest({
      currentSelectedOptions: this.currentSelectedOptions$,
      currentOptions: this.currentOptions$,
    }).pipe(
      map(({ currentSelectedOptions, currentOptions }) =>
        coerceBooleanProperty(
          this.isSuperset(
            new Set(Object.keys(currentSelectedOptions)),
            new Set(Object.keys(currentOptions))
          )
        )
      )
    );
  }

  setUpCurrentOptions(): Observable<AutocompleteConfig> {
    return combineLatest({
      userSearch: this.searchControl.valueChanges.pipe(
        tap((query) => {
          this.isLoading$.next(true);
          this.lastSearchValue = query;
        }),
        debounceTime(500),
        startWith('')
      ),
      data: this.data$.asObservable(),
    }).pipe(
      shareReplay(),
      map(({ userSearch, data }) => {
        const search =
          typeof userSearch === 'string' ? userSearch : userSearch.label;

        const filteredData: AutocompleteConfig = search
          ? this._filter(search as string, data)
          : data;

        this.currentOptions$.next(filteredData);

        return filteredData;
      }),

      tap((currentOptions) => {
        const noCurrentOptions = !Object.keys(currentOptions).length;

        if (noCurrentOptions) {
          !this.emittedUserSearch &&
            this.userSearchToApi.emit(of(this.lastSearchValue || ''));
          if (this.emittedUserSearch) this.isLoading$.next(false);

          return;
        }

        this.isLoading$.next(false);
      })
    );
  }

  transformToConfig(arg: AutocompleteOption[]) {
    if (arg && Array.isArray(arg)) {
      let transformedOptions: AutocompleteConfig = {};

      arg.forEach((option: AutocompleteOption) => {
        transformedOptions[option.value] = { ...option };
      });

      return transformedOptions;
    }

    return arg;
  }

  transformToOption(arg: AutocompleteConfig) {
    if (arg && typeof arg === 'object') {
      let transformedOptions: AutocompleteOption[] = [];
      transformedOptions = Object.values(arg);

      return transformedOptions;
    }

    return arg;
  }

  cacheIncomingData(incomingData: AutocompleteOption[]): void {
    const currData = this.data$.getValue();
    let dataToAdd: AutocompleteConfig = {};

    const mergedData = [
      ...Object.values(this.data$.getValue()),
      ...incomingData,
    ];

    mergedData.forEach((option) => {
      const dataNotExists = !currData[option.value];

      if (dataNotExists) {
        dataToAdd[option.value] = option;
      }
    });

    this.emittedUserSearch = false;
    this.data$.next({ ...currData, ...dataToAdd });
  }

  cacheIncomingSelectedData(incomingData: AutocompleteOption[]): void {}

  unselectOption(optionId: number | string) {
    let currData = this.data$.getValue();

    this.data$.next({
      ...currData,
      [optionId]: { ...currData[optionId], selected: false },
    });

    this.selectedOptions.emit(of(this.currentSelectedOptionsEmit));
  }
}
