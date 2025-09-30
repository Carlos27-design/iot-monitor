import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTemperature } from './card-temperature';

describe('CardTemperature', () => {
  let component: CardTemperature;
  let fixture: ComponentFixture<CardTemperature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTemperature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTemperature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
