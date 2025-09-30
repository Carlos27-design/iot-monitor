import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from '../device/entities/device.entity';

@Entity()
export class DeviceMetric {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Device, (device) => device.metric, { onDelete: 'CASCADE' })
  device: Device;

  @Column('text')
  metric: string;

  @Column('double precision')
  valueNum: number;

  @CreateDateColumn()
  recordedAt: Date;
}
