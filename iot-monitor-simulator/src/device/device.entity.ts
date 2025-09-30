import { Alert } from 'src/alert/alert.entity';
import { DeviceMetric } from 'src/deviceMetric/device-metric.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
