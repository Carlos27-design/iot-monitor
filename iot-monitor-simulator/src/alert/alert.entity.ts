import { Device } from 'src/device/device.entity';
import { DeviceMetric } from 'src/deviceMetric/device-metric.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
