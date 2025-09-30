import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { DeviceData } from '../../core/services/device-data';
import { CardTemperature } from './components/card-temperature/card-temperature';
import { CardHumidity } from './components/card-humidity/card-humidity';
import { CardBattery } from './components/card-battery/card-battery';
import { GraficForDayAlert } from './components/grafic-for-day-alert/grafic-for-day-alert';
import { MaterialModule } from '../../shared/material/material-module';
import { Device } from '../../core/interfaces/device.interface';

@Component({
  selector: 'app-device-metric-page',
  imports: [
    CardTemperature,
    CardHumidity,
    CardBattery,
    GraficForDayAlert,
    RouterLink,
    RouterLinkActive,
    MaterialModule,
  ],
  templateUrl: './device-metric-page.html',
  styleUrl: './device-metric-page.css',
})
export class DeviceMetricPage {
  private _deviceId = signal<string>('');
  private readonly route = inject(ActivatedRoute);
  private readonly deviceData = inject(DeviceData);

  // Resource para cargar el dispositivo inicial
  public deviceResource = rxResource({
    params: () => ({ id: this._deviceId() }),
    stream: ({ params }) => this.deviceData.getDevice(params.id),
  });

  // Signal local del device
  public deviceSignal = signal<Device | null>(null);

  constructor() {
    // Leer ID de la ruta
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this._deviceId.set(id!);
    });

    // Sincronizar resource con signal
    effect(() => {
      const device = this.deviceResource.value();
      if (device) this.deviceSignal.set(device);
    });

    // Escuchar socket de actualizaciones solo de este device
    effect(() => {
      this.deviceData.onDeviceStatusChanged((updatedDevice) => {
        if (updatedDevice.id === this._deviceId()) {
          this.deviceSignal.set(updatedDevice);
        }
      });
    });
  }

  public device = computed(() => this.deviceSignal());
  public deviceName = computed(() => this.device()?.name);

  public toggleDeviceStatus(deviceId: string) {
    this.deviceData.updateDevice(deviceId).subscribe((updatedDevice) => {
      // Solo actualizar este device
      this.deviceSignal.set(updatedDevice);
    });
  }
}
