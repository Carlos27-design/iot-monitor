import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHumidity } from './card-humidity';

describe('CardHumidity', () => {
  let component: CardHumidity;
  let fixture: ComponentFixture<CardHumidity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHumidity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardHumidity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
