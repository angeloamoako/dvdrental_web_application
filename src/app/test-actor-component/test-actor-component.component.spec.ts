import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestActorComponentComponent } from './test-actor-component.component';

describe('TestActorComponentComponent', () => {
  let component: TestActorComponentComponent;
  let fixture: ComponentFixture<TestActorComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestActorComponentComponent]
    });
    fixture = TestBed.createComponent(TestActorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
