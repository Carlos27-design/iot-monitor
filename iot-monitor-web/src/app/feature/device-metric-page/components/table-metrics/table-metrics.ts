import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { MaterialModule } from '../../../../shared/material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DeviceMetric } from '../../../../core/interfaces/device-metric.interface';
import { DeviceMetricData } from '../../../../core/services/device-metric-data';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { DeviceData } from '../../../../core/services/device-data';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ExportMetricExcel } from '../../../../core/services/export-metric-excel';
import { Device } from '../../../../core/interfaces/device.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-metrics',
  imports: [MaterialModule, DecimalPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './table-metrics.html',
  styleUrl: './table-metrics.css',
})
export class TableMetrics {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private deviceMetricData = inject(DeviceMetricData);
  private deviceId = signal<string>('');
  private deviceData = inject(DeviceData);
  private exportMetricExcel = inject(ExportMetricExcel);

  public displayedColumns: string[] = ['metric', 'percent', 'recordedAt'];
  public dataSource = new MatTableDataSource<DeviceMetric>();

  public paginator = viewChild(MatPaginator);

  private formBuilder = inject(FormBuilder);

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

  private getDataSource(deviceMetricId: string) {
    this.deviceMetricData
      .getMetricByDeviceId(deviceMetricId)
      .subscribe((metrics: DeviceMetric[]) => {
        this.dataSource.data = metrics;
        this.dataSource.paginator = this.paginator();
      });
  }

  public exportExcel() {
    const { start, end } = this.formRangePicker.value;
    this.exportMetricExcel.exportMetricsByDeviceId(this.deviceResource.value()!, start!, end!);
  }

  public goToMetric(device: Device) {
    this.router.navigateByUrl(`/dashboard/device-metric/${device.id}`);
  }
}
