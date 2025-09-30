import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from '../device/entities/device.entity';
import { DeviceMetric } from '../device-metric/device-metric.entity';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Device, (device) => device.alerts, { onDelete: 'CASCADE' })
  device: Device;

  @ManyToOne(() => DeviceMetric, { nullable: false })
  metric: DeviceMetric;

  @Column('text')
  alertType: string;

  @Column('text')
  severety: string;

  @Column('text')
  message: string;

  @Column('boolean', { default: false })
  resolved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
