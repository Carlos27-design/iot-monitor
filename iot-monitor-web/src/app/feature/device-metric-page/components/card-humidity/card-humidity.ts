import { DeviceMetricData } from './../../../../core/services/device-metric-data';
import { Component, effect, inject, input, signal } from '@angular/core';
import { MaterialModule } from '../../../../shared/material/material-module';
import { Device } from '../../../../core/interfaces/device.interface';
import { DeviceMetric } from '../../../../core/interfaces/device-metric.interface';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-humidity',
  imports: [MaterialModule, DecimalPipe],
  templateUrl: './card-humidity.html',
  styleUrl: './card-humidity.css',
})
export class CardHumidity {
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
        this.metrics.set(allMetrics.filter((m) => m.metric === 'humidity'));
      });
      this.subscriptions.push(sub1);

      // 2. Suscribirse a nuevas métricas vía socket
      const callback = (metric: DeviceMetric) => {
        if (metric.device.id === device.id && metric.metric === 'humidity') {
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
