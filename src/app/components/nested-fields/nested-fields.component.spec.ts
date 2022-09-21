import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedFieldsComponent } from './nested-fields.component';

describe('NestedFieldsComponent', () => {
  let component: NestedFieldsComponent;
  let fixture: ComponentFixture<NestedFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NestedFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
