import { HttpClient } from '@angular/common/http';
import { ApplicationRef, inject, Injectable, signal } from '@angular/core';
import { Device } from '../interfaces/device.interface';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SOCKET_TOKEN } from '../../app.config';

const URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class DeviceData {
  private http = inject(HttpClient);
  private socket = inject(SOCKET_TOKEN);
  private appRef = inject(ApplicationRef);
  private deviceStatusSubject = new Subject<Device>();

  public devicesStatus = signal<Record<string, Device>>({});

  constructor() {
    this.socket.on('deviceStatusChanged', (updatedDevice: Device) => {
      this.devicesStatus.update((current) => ({
        ...current,
        [updatedDevice.id]: updatedDevice,
      }));

      this.deviceStatusSubject.next(updatedDevice);
      this.appRef.tick();
    });
  }

  public getDeviceStatusUpdates(): Observable<Device> {
    return this.deviceStatusSubject.asObservable();
  }

  public onDeviceStatusChanged(callback: (device: Device) => void) {
    const subscription = this.getDeviceStatusUpdates().subscribe(callback);
    return () => subscription.unsubscribe();
  }
  public getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${URL}/device`);
  }

  public getDevice(id: string): Observable<Device> {
    return this.http.get<Device>(`${URL}/device/${id}`);
  }

  public updateDevice(id: string): Observable<Device> {
    return this.http.patch<Device>(`${URL}/device/status/${id}`, {});
  }
}
