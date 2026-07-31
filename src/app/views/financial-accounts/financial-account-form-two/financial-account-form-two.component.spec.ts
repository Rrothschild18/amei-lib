import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountFormTwoComponent } from './financial-account-form-two.component';

describe('FinancialAccountFormTwoComponent', () => {
  let component: FinancialAccountFormTwoComponent;
  let fixture: ComponentFixture<FinancialAccountFormTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialAccountFormTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAccountFormTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
