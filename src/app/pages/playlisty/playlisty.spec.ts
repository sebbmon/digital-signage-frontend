import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playlisty } from './playlisty';

describe('Playlisty', () => {
  let component: Playlisty;
  let fixture: ComponentFixture<Playlisty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playlisty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Playlisty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
