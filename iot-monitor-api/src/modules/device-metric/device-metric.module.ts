import { Module } from '@nestjs/common';
import { DeviceMetricController } from './device-metric.controller';
import { DeviceMetricService } from './device-metric.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceMetric } from './device-metric.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceMetric]), NotificationModule],
  controllers: [DeviceMetricController],
  providers: [DeviceMetricService],
  exports: [DeviceMetricService],
})
export class DeviceMetricModule {}
