import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Alert } from '../interfaces/alert.interface';
import { Observable } from 'rxjs';

const URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AlertData {
  private http = inject(HttpClient);

  public getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${URL}/alert`);
  }

  public getAlert(id: number): Observable<Alert> {
    return this.http.get<Alert>(`${URL}/alert/${id}`);
  }

  public getAlertByDeviceId(id: string): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${URL}/alert/device/${id}`);
  }

  public getAlertsByDeviceAndPeriod(
    deviceId: string,
    start: string,
    end: string
  ): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${URL}/alert/device/${deviceId}/periodo/${start}/${end}`);
  }
}
