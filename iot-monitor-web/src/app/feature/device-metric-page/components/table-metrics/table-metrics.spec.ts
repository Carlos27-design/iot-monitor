import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMetrics } from './table-metrics';

describe('TableMetrics', () => {
  let component: TableMetrics;
  let fixture: ComponentFixture<TableMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableMetrics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableMetrics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
