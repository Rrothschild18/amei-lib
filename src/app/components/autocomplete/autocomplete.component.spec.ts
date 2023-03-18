import { AutocompleteConfig } from './multiselect-autocomplete.interface';
import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { AutocompleteComponent } from './autocomplete.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChangeDetectorRef, DebugElement } from '@angular/core';

import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

//Inputs tests
// describe('[selectAllOption]', () => {});
describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  let cdr: ChangeDetectorRef;

  function openingAutocomplete() {
    const searchInput = fixture.debugElement.query(By.css('input'));
    searchInput.nativeElement.dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();

    const autocompleteTrigger = fixture.debugElement
      .query(By.directive(MatAutocompleteTrigger))
      .injector.get(MatAutocompleteTrigger);

    autocompleteTrigger.openPanel();
  }

  function selectOptions(optionsLabels: string[]): void {
    const optionsList = fixture.debugElement.queryAll(By.css('.checkbox'));

    optionsList.forEach((_, index) => {
      const label = optionsLabels[index];

      const foundOption = optionsList.find(
        (option) => option.nativeNode.innerText === label
      );

      if (!foundOption) return;

      expect(foundOption).toBeTruthy();

      expect(foundOption?.nativeElement.textContent.trim('')).toEqual(label);

      const checkboxInput = foundOption?.query(
        By.css('input[type="checkbox"]')
      );

      checkboxInput?.nativeElement.click();
      flush();
      fixture.detectChanges();
    });
  }

  //Includes all checked checkbox including "todos"
  function countSelectedOptions(): number {
    const optionsList = fixture.debugElement.queryAll(
      By.css('input[type="checkbox"]')
    );

    let count = 0;

    for (let i = 0; i < optionsList.length; i++) {
      if (optionsList[i].nativeElement.checked) {
        count++;
      }
    }

    return count;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutocompleteComponent],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
  });

  describe('AutocompleteComponent => [Inputs]', () => {
    describe('[placeholder]', () => {
      it(' should be a empty string in the DOM after createComponent()', () => {
        let labelPlaceholderEl: HTMLElement | null | undefined;
        let formField: HTMLElement | null;
        component.placeholder = '';

        cdr.detectChanges();

        formField = document.querySelector('mat-form-field');

        expect(formField).toBeTruthy();

        labelPlaceholderEl = formField?.querySelector('mat-label');

        expect(labelPlaceholderEl?.textContent).toEqual('');
      });

      it(' should show if its declared', () => {
        let labelPlaceholderEl: DebugElement;
        component.placeholder = 'My Placeholder';

        cdr.detectChanges();

        labelPlaceholderEl = fixture.debugElement.query(
          By.css('#labelPlaceholder')
        );

        console.log({ labelPlaceholderEl });

        expect(labelPlaceholderEl?.nativeElement.textContent).toContain(
          component.placeholder
        );
      });
    });

    describe('[appearance]', () => {
      it('should be "outline" as default after createComponent()', fakeAsync(async () => {
        let searchFormFieldHarness: MatFormFieldHarness;
        const loader = TestbedHarnessEnvironment.loader(fixture);
        searchFormFieldHarness = await loader.getHarness(MatFormFieldHarness);

        cdr.detectChanges();

        expect(await searchFormFieldHarness.getAppearance()).toEqual('outline');
      }));

      it('should be "fill" if its declared', fakeAsync(async () => {
        component.appearance = 'fill';
        cdr.detectChanges();

        let searchFormFieldHarness: MatFormFieldHarness;
        const loader = TestbedHarnessEnvironment.loader(fixture);
        searchFormFieldHarness = await loader.getHarness(MatFormFieldHarness);

        expect(await searchFormFieldHarness.getAppearance()).toEqual('fill');
      }));
    });

    describe('[floatingLabel]', () => {
      it('should be "auto" as default after createComponent()', fakeAsync(async () => {
        const loader = TestbedHarnessEnvironment.loader(fixture);
        let searchFormFieldHarness: MatFormFieldHarness =
          await loader.getHarness(MatFormFieldHarness);

        expect(await searchFormFieldHarness.isLabelFloating()).toBeFalse();

        const formField = fixture.debugElement.query(
          By.directive(MatFormField)
        )?.componentInstance;

        expect(formField?.floatLabel).toBe('auto');
      }));

      it('should be "always" if its declared', fakeAsync(async () => {
        component.floatingLabel = 'always';
        cdr.detectChanges();
        const loader = TestbedHarnessEnvironment.loader(fixture);

        let searchFormFieldHarness: MatFormFieldHarness =
          await loader.getHarness(MatFormFieldHarness);

        expect(await searchFormFieldHarness.isLabelFloating()).toBeTrue();

        const formField = fixture.debugElement.query(
          By.directive(MatFormField)
        )?.componentInstance;

        expect(formField?.floatLabel).toBe('always');
      }));
    });

    describe('[multiple]', () => {
      it('should be "true" after createComponent()', fakeAsync(async () => {
        component.multiple = true;
        cdr.detectChanges();

        expect(component.multiple).toBeTrue();
      }));
    });

    describe('[selectAllOption]', () => {
      it('should be "true" after createComponent()', () => {
        component.newData = [
          { label: 'Brazil', value: 1 },
          { label: 'Canada', value: 2 },
          { label: 'Ireland', value: 3 },
          { label: 'Australia', value: 4 },
        ];

        fixture.detectChanges();

        openingAutocomplete();

        expect(component.selectAllOption).toBeTruthy();
      });

      it('if its "false" should`t show select all option', () => {
        component.selectAllOption = false;
        component.newData = [
          { label: 'Brazil', value: 1 },
          { label: 'Canada', value: 2 },
          { label: 'Ireland', value: 3 },
          { label: 'Australia', value: 4 },
        ];

        cdr.detectChanges();

        openingAutocomplete();

        fixture.detectChanges();

        debugger;

        let selectAllOption = fixture.debugElement.query(
          By.css('#selectAllOption')
        );
        debugger;

        expect(selectAllOption).toBeNull();
      });

      it('if its "true" and has one option should`t show select all option', () => {
        component.selectAllOption = true;
        component.newData = [{ label: 'Brazil', value: 1 }];

        cdr.detectChanges();

        openingAutocomplete();

        fixture.detectChanges();

        let selectAllOption = fixture.debugElement.query(
          By.css('#selectAllOption')
        );

        expect(selectAllOption).toBeNull();
      });

      it('if its "true" after and have more than one option should appear select all option', () => {
        component.newData = [
          { label: 'Brazil', value: 1 },
          { label: 'Canada', value: 2 },
          { label: 'Ireland', value: 3 },
          { label: 'Australia', value: 4 },
        ];

        cdr.detectChanges();

        openingAutocomplete();

        fixture.detectChanges();

        let selectAllOption = fixture.debugElement.query(
          By.css('#selectAllOption')
        );

        expect(selectAllOption).toBeTruthy();
      });
    });
  });

  describe('AutocompleteComponent => Behavioral [multiple]', () => {
    it('[multiple] if its "true" should be able to select more than one option', fakeAsync(async () => {
      component.multiple = true;
      component.newData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
        { label: 'Australia', value: 4 },
      ];
      cdr.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      selectOptions(['Brazil', 'Australia', 'Ireland']);

      expect(component.multiple).toBeTrue();
      expect(countSelectedOptions()).toBe(3);
    }));

    it('[multiple] if its "false" should be able to select only one option', fakeAsync(async () => {
      component.multiple = false;
      component.newData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
        { label: 'Australia', value: 4 },
      ];
      cdr.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      selectOptions(['Brazil', 'Australia']);

      expect(component.multiple).toBeFalse();
      expect(countSelectedOptions()).toBe(1);
    }));
  });

  describe('AutocompleteComponent => Behavioral [data]', () => {
    it('[data] if have data should show options after trigger autocomplete', () => {
      component.newData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
        { label: 'Australia', value: 4 },
      ];

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      let optionsList = fixture.debugElement.queryAll(By.css('.checkbox'));

      expect(optionsList.length).toBe(5);
    });

    it('[data] if have no data should show message', () => {
      component.newData = [];

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      let optionsList = fixture.debugElement.queryAll(By.css('.checkbox'));
      let noOptionsFoundMessage = fixture.debugElement.query(By.css('h6'));

      expect(optionsList.length).toBe(0);
      expect(noOptionsFoundMessage.nativeElement.textContent).toEqual(
        'Não foram encontrados resultados'
      );
    });

    it('[data] if have no data should show same options after trigger autocomplete [cacheData] is "true" ', () => {
      component.cacheData = true;
      component.newData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
        { label: 'Australia', value: 4 },
      ];

      const mockResult: AutocompleteConfig = {
        1: { label: 'Brazil', value: 1 },
        2: { label: 'Canada', value: 2 },
        3: { label: 'Ireland', value: 3 },
        4: { label: 'Australia', value: 4 },
      };

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      let optionsList = fixture.debugElement.queryAll(By.css('.checkbox'));

      //Should show options
      expect(optionsList.length).toBe(5);

      component.newData = [];

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      //Should show options
      expect(optionsList.length).toBe(5);

      //Should be same options as before
      expect(component.data$.getValue()).toEqual(mockResult);
    });

    it('[data] if have data and incoming data the options should be only the difference between local data and incoming if [cacheData] is "true" ', () => {
      component.cacheData = true;
      component.newData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
      ];

      const mockResult: AutocompleteConfig = {
        1: { label: 'Brazil', value: 1 },
        2: { label: 'Canada', value: 2 },
      };

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      let optionsList = fixture.debugElement.queryAll(By.css('.checkbox'));

      //Should show options
      expect(optionsList.length).toBe(3);

      expect(component.data$.getValue()).toEqual(mockResult);

      const mockResult2: AutocompleteConfig = {
        1: { label: 'Brazil', value: 1 },
        2: { label: 'Canada', value: 2 },
        3: { label: 'Ireland', value: 3 },
        4: { label: 'Australia', value: 4 },
      };

      component.newData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
        { label: 'Australia', value: 4 },
      ];

      cdr.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      optionsList = fixture.debugElement.queryAll(By.css('.checkbox'));

      //Should show options
      expect(optionsList.length).toBe(5);

      //Should be same options as before
      expect(component.data$.getValue()).toEqual(mockResult2);
    });
  });

  describe('AutocompleteComponent => Behavioral [selectData]', () => {
    it('[selectData] if have selected data and [cacheSelectData] is "true" should appear at data', () => {
      component.cacheSelectData = true;
      component.newData = [];
      component.onSelectedData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
      ];

      const mockResult: AutocompleteConfig = {
        1: { label: 'Brazil', value: 1, selected: true },
        2: { label: 'Canada', value: 2, selected: true },
        3: { label: 'Ireland', value: 3, selected: true },
      };

      cdr.detectChanges();

      expect(component.data$.getValue()).toEqual(mockResult);
    });

    it('[selectData] if have selected data and [cacheSelectData] is "false" but the option exists at [data] should be selected at data', () => {
      component.cacheSelectData = false;
      component.newData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
      ];
      component.onSelectedData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
      ];

      const mockResult: AutocompleteConfig = {
        1: { label: 'Brazil', value: 1, selected: true },
        2: { label: 'Canada', value: 2, selected: true },
      };

      cdr.detectChanges();

      expect(component.cacheSelectData).toBeFalse();
      expect(component.data$.getValue()).toEqual(mockResult);
    });

    it('[selectData] if have selected data and [cacheSelectData] is "false" but the option dont exists at [data] should not be selected at data', () => {
      component.cacheSelectData = false;
      component.newData = [];
      component.onSelectedData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
      ];

      const mockResult: AutocompleteConfig = {};

      cdr.detectChanges();

      expect(component.data$.getValue()).toEqual(mockResult);
    });
  });

  describe('AutocompleteComponent => Behavioral mat-checkbox (change)', () => {
    it('an clicked option should turn selected if its unselected', fakeAsync(() => {
      component.newData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
        { label: 'Australia', value: 4 },
      ];

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      const optionsList = fixture.debugElement.queryAll(By.css('.checkbox'));

      const brazilOption = optionsList.find(
        (option) => option.nativeNode.innerText === 'Brazil'
      );

      const brazilCheckbox = brazilOption?.query(
        By.css('input[type="checkbox"]')
      );

      selectOptions(['Brazil']);

      fixture.detectChanges();

      expect(brazilCheckbox?.nativeElement.checked).toBeTrue();
      expect(countSelectedOptions()).toBe(1);
    }));

    it('an clicked option should turn unselected if its selected', fakeAsync(() => {
      component.newData = [
        { label: 'Brazil', value: 1, selected: true },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
        { label: 'Australia', value: 4 },
      ];

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      const optionsList = fixture.debugElement.queryAll(By.css('.checkbox'));

      const brazilOption = optionsList.find(
        (option) => option.nativeNode.innerText === 'Brazil'
      );

      const brazilCheckbox = brazilOption?.query(
        By.css('input[type="checkbox"]')
      );

      fixture.detectChanges();

      expect(brazilCheckbox?.nativeElement.checked).toBeTrue();

      selectOptions(['Brazil']);

      fixture.detectChanges();

      expect(brazilCheckbox?.nativeElement.checked).toBeFalse();

      expect(countSelectedOptions()).toBe(0);
    }));

    it('if all options are selected "Todas" option also must be selected', fakeAsync(() => {
      component.newData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
        { label: 'Australia', value: 4 },
      ];

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      selectOptions(['Brazil', 'Canada', 'Ireland', 'Australia']);

      fixture.detectChanges();

      expect(countSelectedOptions()).toBe(5);

      const selectAllWrapper = fixture.debugElement.query(By.css('.checkbox'));

      const selectAllCheckbox = selectAllWrapper?.query(
        By.css('input[type="checkbox"]')
      );

      fixture.detectChanges();

      expect(selectAllCheckbox?.nativeElement.checked).toBeTrue();
    }));

    it('if not all options are selected "Todas" must be unselected', fakeAsync(() => {
      component.newData = [
        { label: 'Brazil', value: 1, selected: true },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3, selected: true },
        { label: 'Australia', value: 4, selected: true },
      ];

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      // selectOptions(['Brazil', 'Canada', 'Ireland', 'Australia']);

      // fixture.detectChanges();

      expect(countSelectedOptions()).toBe(3);

      const selectAllWrapper = fixture.debugElement.query(By.css('.checkbox'));

      const selectAllCheckbox = selectAllWrapper?.query(
        By.css('input[type="checkbox"]')
      );

      fixture.detectChanges();

      expect(selectAllCheckbox?.nativeElement.checked).toBeFalse();
    }));

    it('if option "Todas" is unselected and its no selected options "Todas" when clicked must select all current options', fakeAsync(() => {
      component.newData = [
        { label: 'Brazil', value: 1 },
        { label: 'Canada', value: 2 },
        { label: 'Ireland', value: 3 },
        { label: 'Australia', value: 4 },
      ];
      debugger;

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      debugger;

      selectOptions(['Brazil', 'Canada', 'Ireland', 'Australia']);

      debugger;

      fixture.detectChanges();

      expect(countSelectedOptions()).toBe(5);

      debugger;

      const mockResult: AutocompleteConfig = {
        1: { label: 'Brazil', value: 1, selected: true },
        2: { label: 'Canada', value: 2, selected: true },
        3: { label: 'Ireland', value: 3, selected: true },
        4: { label: 'Australia', value: 4, selected: true },
      };

      debugger;

      expect(component.data$.getValue()).toEqual(mockResult);
    }));

    it('if option "Todas" is unselected and some options are selected when its "Todas" is clicked must select all unselected current options', fakeAsync(() => {
      component.newData = [
        { label: 'Brazil', value: 1, selected: true },
        { label: 'Canada', value: 2, selected: true },
        { label: 'Ireland', value: 3 },
        { label: 'Australia', value: 4 },
      ];

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      selectOptions(['Ireland', 'Australia']);

      fixture.detectChanges();

      expect(countSelectedOptions()).toBe(5);

      const mockResult: AutocompleteConfig = {
        1: { label: 'Brazil', value: 1, selected: true },
        2: { label: 'Canada', value: 2, selected: true },
        3: { label: 'Ireland', value: 3, selected: true },
        4: { label: 'Australia', value: 4, selected: true },
      };

      expect(component.data$.getValue()).toEqual(mockResult);
    }));

    it('if option "Todas" is selected when its clicked must unselect all current options', fakeAsync(() => {
      component.newData = [
        { label: 'Brazil', value: 1, selected: true },
        { label: 'Canada', value: 2, selected: true },
        { label: 'Ireland', value: 3, selected: true },
        { label: 'Australia', value: 4, selected: true },
      ];

      fixture.detectChanges();

      openingAutocomplete();

      fixture.detectChanges();

      expect(countSelectedOptions()).toBe(5);

      const selectAllWrapper = fixture.debugElement.query(By.css('.checkbox'));

      const selectAllCheckbox = selectAllWrapper?.query(
        By.css('input[type="checkbox"]')
      );

      selectAllCheckbox?.nativeElement.click();

      fixture.detectChanges();

      const mockResult: AutocompleteConfig = {
        1: { label: 'Brazil', value: 1, selected: false },
        2: { label: 'Canada', value: 2, selected: false },
        3: { label: 'Ireland', value: 3, selected: false },
        4: { label: 'Australia', value: 4, selected: false },
      };

      /*
      Should be, i think
      const mockResult: AutocompleteConfig = {
        1: { label: 'Brazil', value: 1 },
        2: { label: 'Canada', value: 2 },
        3: { label: 'Ireland', value: 3 },
        4: { label: 'Australia', value: 4 },
      };
      **/

      expect(countSelectedOptions()).toBe(0);

      expect(component.data$.getValue()).toEqual(mockResult);
    }));
  });
});
