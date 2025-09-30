import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertData } from '../../../../core/services/alert-data';
import { DeviceData } from '../../../../core/services/device-data';
import { Alert } from '../../../../core/interfaces/alert.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { rxResource } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../../shared/material/material-module';
import { DatePipe } from '@angular/common';
import { ExportAlertExcel } from '../../../../core/services/export-alert-excel';
import { Device } from '../../../../core/interfaces/device.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-alerts',
  imports: [MaterialModule, DatePipe, ReactiveFormsModule],
  templateUrl: './table-alerts.html',
  styleUrl: './table-alerts.css',
})
export class TableAlerts {
  private route = inject(ActivatedRoute);
  private alertData = inject(AlertData);
  private deviceId = signal<string>('');
  private deviceData = inject(DeviceData);
  private exportAlertExcel = inject(ExportAlertExcel);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  public displayedColumns: string[] = ['metric', 'alertType', 'severety', 'resolved', 'createdAt'];
  public dataSource = new MatTableDataSource<Alert>();

  public paginator = viewChild(MatPaginator);

  public deviceResource = rxResource({
    params: () => ({ id: this.deviceId() }),
    stream: ({ params }) => this.deviceData.getDevice(params.id),
  });

  public formRangePicker = this.formBuilder.group({
    start: [''],
    end: [''],
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.deviceId.set(id!);
    });

    effect(() => {
      this.getDataSource(this.deviceId());
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator();
  }

  private getDataSource(deviceId: string) {
    this.alertData.getAlertByDeviceId(deviceId).subscribe((alerts: Alert[]) => {
      this.dataSource.data = alerts;
      this.dataSource.paginator = this.paginator();
    });
  }

  public exportExcel() {
    const { start, end } = this.formRangePicker.value;
    this.exportAlertExcel.exportAlertsExcel(this.deviceResource.value()!, start!, end!);
  }

  public goToMetric(device: Device) {
    this.router.navigateByUrl(`/dashboard/device-metric/${device.id}`);
  }
}
