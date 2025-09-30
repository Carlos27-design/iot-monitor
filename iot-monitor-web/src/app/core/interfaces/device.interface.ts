import { Alert } from './alert.interface';
import { DeviceMetric } from './device-metric.interface';

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  metric: DeviceMetric[];
  alerts: Alert[];
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
