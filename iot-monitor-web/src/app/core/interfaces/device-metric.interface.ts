import { Device } from './device.interface';

export interface DeviceMetric {
  id: number;
  device: Device;
  metric: string;
  valueNum: number;
  recordedAt: Date;
}
