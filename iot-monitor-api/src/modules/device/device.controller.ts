import { Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @Auth()
  findAll() {
    return this.deviceService.findAll();
  }

  @Get(':id')
  @Auth()
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceService.findById(id);
  }

  @Patch('status/:id')
  @Auth()
  updateDeviceStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceService.updateDeviceStatus(id);
  }
}
