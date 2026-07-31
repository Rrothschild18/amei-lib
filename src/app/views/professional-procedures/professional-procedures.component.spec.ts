import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalProceduresComponent } from './professional-procedures.component';

describe('ProfessionalProceduresComponent', () => {
  let component: ProfessionalProceduresComponent;
  let fixture: ComponentFixture<ProfessionalProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalProceduresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
