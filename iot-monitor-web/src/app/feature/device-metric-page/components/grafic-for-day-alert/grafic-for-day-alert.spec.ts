import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficForDayAlert } from './grafic-for-day-alert';

describe('GraficForDayAlert', () => {
  let component: GraficForDayAlert;
  let fixture: ComponentFixture<GraficForDayAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficForDayAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficForDayAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
