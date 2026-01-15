import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grupy } from './grupy';

describe('Grupy', () => {
  let component: Grupy;
  let fixture: ComponentFixture<Grupy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grupy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Grupy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
