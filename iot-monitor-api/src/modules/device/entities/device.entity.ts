import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeviceMetric } from '../../device-metric/device-metric.entity';
import { Alert } from '../../alert/alert.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @Column('varchar', { length: 100, unique: true, nullable: false })
  serialNumber: string;

  @Column('text', { default: 'offline' })
  status: string;

  @OneToMany(() => DeviceMetric, (metric) => metric.device)
  metric: DeviceMetric[];

  @OneToMany(() => Alert, (alert) => alert.device)
  alerts: Alert[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
