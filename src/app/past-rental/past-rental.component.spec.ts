import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastRentalComponent } from './past-rental.component';

describe('PastRentalComponent', () => {
  let component: PastRentalComponent;
  let fixture: ComponentFixture<PastRentalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PastRentalComponent]
    });
    fixture = TestBed.createComponent(PastRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
