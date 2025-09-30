import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMetricPage } from './device-metric-page';

describe('DeviceMetricPage', () => {
  let component: DeviceMetricPage;
  let fixture: ComponentFixture<DeviceMetricPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceMetricPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceMetricPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
