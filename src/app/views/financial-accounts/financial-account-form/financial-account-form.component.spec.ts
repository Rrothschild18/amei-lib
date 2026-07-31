import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountFormComponent } from './financial-account-form.component';

describe('FinancialAccountFormComponent', () => {
  let component: FinancialAccountFormComponent;
  let fixture: ComponentFixture<FinancialAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialAccountFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
