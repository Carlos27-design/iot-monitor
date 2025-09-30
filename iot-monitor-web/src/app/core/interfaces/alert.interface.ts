import { DeviceMetric } from './device-metric.interface';
import { Device } from './device.interface';

export interface Alert {
  id: number;
  device: Device;
  metric: DeviceMetric;
  alertType: string;
  severety: string;
  message: string;
  resolved: boolean;
  createdAt: Date;
}
