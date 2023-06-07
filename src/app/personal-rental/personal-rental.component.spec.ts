import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalRentalComponent } from './personal-rental.component';

describe('PersonalRentalComponent', () => {
  let component: PersonalRentalComponent;
  let fixture: ComponentFixture<PersonalRentalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalRentalComponent]
    });
    fixture = TestBed.createComponent(PersonalRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
