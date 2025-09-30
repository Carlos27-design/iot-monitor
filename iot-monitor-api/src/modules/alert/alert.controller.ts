import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { Alert } from './alert.entity';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @Auth()
  findAll(): Promise<Alert[]> {
    return this.alertService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: number): Promise<Alert> {
    return this.alertService.findById(id);
  }

  @Get('device/:deviceId')
  @Auth()
  findByDeviceId(@Param('deviceId') deviceId: string): Promise<Alert[]> {
    return this.alertService.findByDeviceId(deviceId);
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
    return this.alertService.findByDeviceIdAndPeriodo(deviceId, periodo);
  }
}
