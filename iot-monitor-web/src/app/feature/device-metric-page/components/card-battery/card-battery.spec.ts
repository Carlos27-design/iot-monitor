import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBattery } from './card-battery';

describe('CardBattery', () => {
  let component: CardBattery;
  let fixture: ComponentFixture<CardBattery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBattery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBattery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
