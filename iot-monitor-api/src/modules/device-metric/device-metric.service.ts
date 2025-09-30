import { Injectable } from '@nestjs/common';
import { DeviceMetric } from './device-metric.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { NotificationGateway } from '../notification/notification.gateway';

interface Periodo {
  start: Date;
  end: Date;
}

@Injectable()
export class DeviceMetricService {
  constructor(
    @InjectRepository(DeviceMetric)
    private readonly deviceMetricRepository: Repository<DeviceMetric>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  public async create(metric: Partial<DeviceMetric>): Promise<DeviceMetric> {
    const newMetric = this.deviceMetricRepository.create({
      ...metric,
      device: { id: metric.device?.id },
    });

    const savedMetric = await this.deviceMetricRepository.save(newMetric);
    this.notificationGateway.sendMetric(savedMetric);
    return savedMetric;
  }

  public async findAll(): Promise<DeviceMetric[]> {
    return await this.deviceMetricRepository.find({
      relations: ['device'],
    });
  }

  public async findByDeviceId(deviceId: string): Promise<DeviceMetric[]> {
    return await this.deviceMetricRepository.find({
      where: { device: { id: deviceId } },
      order: { recordedAt: 'DESC' },
      relations: ['device'],
    });
  }

  public async findByDeviceIdAndPeriodo(deviceId: string, periodo: Periodo) {
    return await this.deviceMetricRepository.find({
      where: {
        device: { id: deviceId },
        recordedAt: Between(periodo.start, periodo.end),
      },
      order: { recordedAt: 'DESC' },
      relations: ['device'],
    });
  }
}
