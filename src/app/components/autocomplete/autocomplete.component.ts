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
  @Input() selectAllOption: boolean = true;
  @Input('selectedData') set onSelectedData(data: AutocompleteOption[] | null) {
    const hasData = !!data?.length;
    if (hasData) {
      const mergedData = [...Object.values(this.selectedData), ...data];
      mergedData.forEach((option) => {
        const optionNotExists = !this.data[option.value];

        if (optionNotExists) {
          const currSelected = this.currentSelectedOptions$.getValue();
          this.data[option.value] = { ...option, selected: true };
          currSelected[option.value] = { ...option, selected: true };
          this.currentOptions$.next(currSelected);
          this.selectedOptions.next(of(Object.values(currSelected)));

          // return;
        } else {
          const currSelected = this.currentSelectedOptions$.getValue();

          this.data[option.value].selected = true;
          currSelected[option.value] = this.data[option.value];

          this.selectedOptions.next(of(Object.values(currSelected)));
          // return;
        }
      });

      this.onSelectChange();

      return;
    }

    this.selectedData = {};
  }

  @Input('data') set newData(incomingData: AutocompleteOption[] | null) {
    const hasIncomingData = !!incomingData?.length;
    const currSelected = Object.values(this.currentSelectedOptions$.getValue());

    if (hasIncomingData) {
      const mergedData = [...Object.values(this.data), ...incomingData];

      mergedData.forEach((option) => {
        const optionNotExists = !this.data[option.value];

        if (optionNotExists) {
          this.data[option.value] = option;
        }
      });

      if (this.emittedUserSearch) {
        this.emittedUserSearch = false;
        this.isLoading = false;
        this.searchNotFound = true;
      }

      const transformedIncomingData: {
        [key: string | number]: AutocompleteOption;
      } = {};

      incomingData.forEach((option) => {
        transformedIncomingData[option.value] = this.data[option.value];
      });

      this.currentOptions$.next(transformedIncomingData);
      this.selectedOptions.next(of(currSelected));
      this.onSelectChange();

      return;
    }

    //TODO: Verify why an event emitter triggers component states
    this.selectedOptions.next(of(currSelected));
    this.emittedUserSearch = false;
    this.isLoading = false;
    this.searchNotFound = true;
    this.data = { ...this.data };
  }

  @Output() selectedOptions = new EventEmitter<
    Observable<AutocompleteOption[]>
  >();

  @Output() userSearchToApi = new EventEmitter<Observable<string>>();

  data: AutocompleteConfig = {};
  selectedData: AutocompleteConfig = {};

  currentOptions$ = new BehaviorSubject<AutocompleteConfig>({});
  currentSelectedOptions$ = new BehaviorSubject<AutocompleteConfig>({});
  allSelected$ = new BehaviorSubject(false);

  searchControl: FormControl = new FormControl('');
  lastSearchValue: string | null = null;
  isLoading: boolean = false;
  searchNotFound: boolean = false;
  emittedUserSearch: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        tap((searchControlValue) => {
          this.isLoading = true;
          this.lastSearchValue = searchControlValue;
          this.searchNotFound = false;
        }),
        debounceTime(500),
        map((searchControlValue) => {
          const search =
            typeof searchControlValue === 'string'
              ? searchControlValue
              : searchControlValue.label;

          return search ? this._filter(search as string) : this.data;
        }),
        tap((currentOptions) => {
          this.currentOptions$.next(currentOptions);
        }),
        tap((currentOptions) => {
          // if (this.lastSearchValue && !this.searchNotFound) {
          //   this.isLoading = true;
          //   this.emittedUserSearch = true;
          //   return;
          // }
          // this.isLoading = false;

          this.userSearchToApi.next(of(this.lastSearchValue || ''));
          this.isLoading = false;
          this.emittedUserSearch = true;

          return;
        })
      )
      .subscribe(() => {
        this.onSelectChange();
      });
  }

  //Delete
  get currentSelectedIdsHTML(): string {
    return Object.keys(this.currentSelectedOptions$.getValue())
      .map((v) => v)
      .join(',');
  }

  get hasOptionsToToggle(): boolean {
    return Object.keys(this.currentOptions$.getValue()).length > 1;
  }

  onSelectChange(): void {
    const currentSelectedOptions = this.currentSelectedOptions$.getValue();
    const currentOptions = this.currentOptions$.getValue();
    const hasCurrentSelectedOptions = !!Object.values(currentSelectedOptions)
      .length;
    const hasCurrentOptions = !!Object.values(currentOptions).length;

    if (!hasCurrentSelectedOptions || !hasCurrentOptions) {
      this.allSelected$.next(false);
      return;
    }

    const isSuperSet = this.isSuperset(
      new Set(Object.keys(currentSelectedOptions)),
      new Set(Object.keys(currentOptions))
    );

    this.allSelected$.next(isSuperSet);
  }

  private _filter(label: string): AutocompleteConfig {
    const filterValue = label.toLowerCase();

    const filteredIds = Object.values(this.data)
      .filter((option: any) => option.label.toLowerCase().includes(filterValue))
      .map((option) => option.value);

    let filteredData: AutocompleteConfig = {};

    filteredIds.forEach(
      (optionId) => (filteredData[optionId] = this.data[optionId])
    );

    return filteredData;
  }

  trackByFn(option: any, option2: any) {
    return option2['key'];
  }

  onAddOption(optionId: string | number) {
    const currentSelected = this.currentSelectedOptions$.getValue();
    const currentOptions = this.currentOptions$.getValue();

    if (currentSelected[optionId]) {
      //update current options
      currentOptions[optionId].selected = false;
      this.data[optionId].selected = false;

      //update current selected
      delete currentSelected[optionId];
      this.currentSelectedOptions$.next(currentSelected);

      //Event Emitter
      this.selectedOptions.next(of(Object.values(currentSelected)));
      this.onSelectChange();
      return;
    } else {
      //Update current options
      currentOptions[optionId].selected = true;
      this.currentOptions$.next(currentOptions);

      //update current selected
      currentSelected[optionId] = {
        ...currentOptions[optionId],
        selected: true,
      };

      this.currentSelectedOptions$.next({ ...currentSelected });

      //Event Emitter
      this.selectedOptions.next(of(Object.values(currentSelected)));
      this.onSelectChange();
    }
  }

  onSelectAll() {
    const currentOptionsKeys = Object.keys(this.currentOptions$.getValue());
    const currentSelectedOptionsKeys = Object.keys(
      this.currentSelectedOptions$.getValue()
    );
    const hasCurrentSelectedOptionsKeys = !!currentSelectedOptionsKeys.length;
    const allSelected = this.allSelected$.getValue();

    const currentOptions = this.currentOptions$.getValue();
    const currentSelectedOptions = this.currentSelectedOptions$.getValue();

    /**
     * Case 1 - All current data is selected
     */
    if (allSelected) {
      /**
       * Case 1.1 - Has previous selectedData, add currOpt that is not selected
       */
      if (hasCurrentSelectedOptionsKeys) {
        currentOptionsKeys.forEach((currOptionId) => {
          const isSelected = currentOptions[currOptionId].selected;

          if (isSelected) {
            this.onAddOption(currOptionId);
          }

          return;
        });

        this.onSelectChange();
        return;
      }
      /**
       * Case 1.2 - No selected data,  add all currOptions
       */
      if (!hasCurrentSelectedOptionsKeys) {
        currentOptionsKeys.forEach((currOptionId) => {
          this.onAddOption(currOptionId);
        });

        this.onSelectChange();
        return;
      }
    }
    /**
     * Case 2 - All current data is not selected
     */
    if (!allSelected) {
      /**
       * Case 2.1 - not all is selected and have previous selected data
       * add only not selected
       */
      if (hasCurrentSelectedOptionsKeys) {
        currentOptionsKeys.forEach((currOptionId) => {
          const isNotSelected = !currentOptions[currOptionId].selected;

          if (isNotSelected) {
            this.onAddOption(currOptionId);
          }
        });

        return;
      }
      /**
       * Case 2.2 - Not all selected and no previous selected,
       * add curr options
       */
      if (!hasCurrentSelectedOptionsKeys) {
        currentOptionsKeys.forEach((currOptionId) => {
          this.onAddOption(currOptionId);
        });

        this.onSelectChange();

        return;
      }
    }
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
