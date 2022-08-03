import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTestComponent } from './list-test.component';

describe('ListTestComponent', () => {
  let component: ListTestComponent;
  let fixture: ComponentFixture<ListTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
