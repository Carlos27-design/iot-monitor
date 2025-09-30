import { inject, Injectable, signal, ApplicationRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { DeviceMetric } from '../interfaces/device-metric.interface';
import { SOCKET_TOKEN } from '../../app.config';

const URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class DeviceMetricData {
  private http = inject(HttpClient);
  private socket = inject(SOCKET_TOKEN);
  private appRef = inject(ApplicationRef);

  private metricsSubject = new Subject<DeviceMetric>();

  // Guardar métricas por device y tipo
  public metricsByDevice = signal<
    Record<
      string,
      { temperature: DeviceMetric[]; battery: DeviceMetric[]; humidity: DeviceMetric[] }
    >
  >({});

  // Estado actual de los dispositivos
  private deviceStatus: Record<string, 'online' | 'offline'> = {};

  constructor() {
    // Escuchar métricas desde el socket
    this.socket.on('metric', (metric: DeviceMetric) => {
      const deviceId = metric.device?.id;
      if (!deviceId) return;

      // Ignorar métricas si el dispositivo está en estado "offline"
      if (this.deviceStatus[deviceId] === 'offline') {
        console.log(`Métrica ignorada porque el dispositivo ${deviceId} está OFFLINE`);
        return;
      }

      const type = metric.metric.toLowerCase() as 'temperature' | 'battery' | 'humidity';
      if (!['temperature', 'battery', 'humidity'].includes(type)) return;

      // Actualizar signal
      this.metricsByDevice.update((current) => {
        const deviceMetrics = current[deviceId] ?? { temperature: [], battery: [], humidity: [] };
        const updatedMetrics = [...(deviceMetrics[type] ?? []), metric];

        // Mantener máximo 50 métricas
        if (updatedMetrics.length > 50) updatedMetrics.splice(0, updatedMetrics.length - 50);

        deviceMetrics[type] = updatedMetrics;
        return { ...current, [deviceId]: deviceMetrics };
      });

      this.metricsSubject.next(metric);
      this.appRef.tick();
    });
  }

  /**
   * Actualizar el estado de un dispositivo
   */
  public updateDeviceStatus(deviceId: string, status: 'online' | 'offline') {
    console.log('Actualizando estado de dispositivo:', { deviceId, status });
    this.deviceStatus[deviceId] = status;
    console.log('Estado actual de todos los dispositivos:', this.deviceStatus);
  }

  /**
   * Obtener las actualizaciones en tiempo real como Observable
   */
  public getMetricUpdates(): Observable<DeviceMetric> {
    return this.metricsSubject.asObservable();
  }

  /**
   * Obtener todas las métricas
   */
  public getMetrics(): Observable<DeviceMetric[]> {
    return this.http.get<DeviceMetric[]>(`${URL}/device-metric`);
  }

  /**
   * Obtener métricas de un dispositivo específico
   */
  public getMetricByDeviceId(id: string): Observable<DeviceMetric[]> {
    return this.http.get<DeviceMetric[]>(`${URL}/device-metric/device/${id}`);
  }

  /**
   * Escuchar el evento de métricas directamente
   */
  onMetric(callback: (metric: DeviceMetric) => void) {
    this.socket.on('metric', callback);

    // Retorna función para desuscribirse
    return () => {
      this.socket.off('metric');
    };
  }

  public getMetricsByDeviceAndPeriod(
    deviceId: string,
    start: string,
    end: string
  ): Observable<DeviceMetric[]> {
    return this.http.get<DeviceMetric[]>(
      `${URL}/device-metric/device/${deviceId}/periodo/${start}/${end}`
    );
  }
}
