import { Component, effect, inject, input, signal, OnDestroy } from '@angular/core';
import { DeviceMetricData } from '../../../../core/services/device-metric-data';
import { Device } from '../../../../core/interfaces/device.interface';
import { DeviceMetric } from '../../../../core/interfaces/device-metric.interface';
import { MaterialModule } from '../../../../shared/material/material-module';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-temperature',
  imports: [MaterialModule, DecimalPipe],
  templateUrl: './card-temperature.html',
  styleUrl: './card-temperature.css',
})
export class CardTemperature {
  public device = input<Device>();
  public metrics = signal<DeviceMetric[]>([]);

  private deviceMetricData = inject(DeviceMetricData);
  private subscriptions: Subscription[] = [];
  private unsubscribeSocket?: () => void; // <- Para manejar socket manualmente

  constructor() {
    // Effect para detectar cambio de dispositivo
    effect(() => {
      const device = this.device();
      if (!device) return;

      // Limpiar suscripciones anteriores
      this.cleanSubscriptions();

      this.metrics.set([]);

      // Solo subscribirse si el dispositivo está online
      if (device.status === 'offline') {
        return;
      }

      // 1. Cargar métricas iniciales
      const sub1 = this.deviceMetricData.getMetricByDeviceId(device.id).subscribe((allMetrics) => {
        this.metrics.set(allMetrics.filter((m) => m.metric === 'temperature'));
      });
      this.subscriptions.push(sub1);

      // 2. Suscribirse a nuevas métricas vía socket
      const callback = (metric: DeviceMetric) => {
        if (metric.device.id === device.id && metric.metric === 'temperature') {
          this.metrics.update((current) => [...current, metric]);
        }
      };

      // Guardar función para desuscribirse luego
      this.unsubscribeSocket = this.deviceMetricData.onMetric(callback);
    });
  }

  /** Limpia todas las suscripciones y sockets */
  private cleanSubscriptions() {
    // RxJS subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    // Socket
    if (this.unsubscribeSocket) {
      this.unsubscribeSocket();
      this.unsubscribeSocket = undefined;
    }
  }

  ngOnDestroy() {
    this.cleanSubscriptions();
  }
}
