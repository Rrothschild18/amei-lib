import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFormTwoComponent } from './patient-form-two.component';

describe('PatientFormTwoComponent', () => {
  let component: PatientFormTwoComponent;
  let fixture: ComponentFixture<PatientFormTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFormTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFormTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
