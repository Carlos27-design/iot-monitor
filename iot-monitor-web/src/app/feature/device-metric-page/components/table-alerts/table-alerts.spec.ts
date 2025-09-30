import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAlerts } from './table-alerts';

describe('TableAlerts', () => {
  let component: TableAlerts;
  let fixture: ComponentFixture<TableAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableAlerts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableAlerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
