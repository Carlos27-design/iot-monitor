import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeviceMetricService } from './device-metric.service';
import { DeviceMetric } from './device-metric.entity';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('device-metric')
export class DeviceMetricController {
  constructor(private readonly deviceMetricService: DeviceMetricService) {}

  @Get()
  @Auth()
  findAll(): Promise<DeviceMetric[]> {
    return this.deviceMetricService.findAll();
  }

  @Get('device/:deviceId')
  @Auth()
  findByDeviceId(@Param('deviceId') deviceId: string): Promise<DeviceMetric[]> {
    return this.deviceMetricService.findByDeviceId(deviceId);
  }

  @Get('device/:deviceId/periodo/:start/:end')
  @Auth()
  findByDeviceIdAndPeriodo(
    @Param('deviceId') deviceId: string,
    @Param('start') start: string,
    @Param('end') end: string,
  ) {
    const periodo = {
      start: new Date(start),
      end: new Date(end),
    };
    return this.deviceMetricService.findByDeviceIdAndPeriodo(deviceId, periodo);
  }
}
