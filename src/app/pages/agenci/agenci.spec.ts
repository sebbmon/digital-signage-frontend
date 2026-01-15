import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agenci } from './agenci';

describe('Agenci', () => {
  let component: Agenci;
  let fixture: ComponentFixture<Agenci>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agenci]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Agenci);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
