import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'src/device/device.entity';
import { DeviceMetric } from 'src/deviceMetric/device-metric.entity';
import { Alert } from 'src/alert/alert.entity';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Device, DeviceMetric, Alert])],
  providers: [SimulationService, NotificationGateway],
  exports: [SimulationService],
})
export class SimulationModule {}
