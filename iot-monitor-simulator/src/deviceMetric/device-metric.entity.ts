import { Device } from 'src/device/device.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
