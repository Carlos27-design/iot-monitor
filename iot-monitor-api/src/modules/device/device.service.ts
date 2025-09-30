import { NotificationGateway } from './../notification/notification.gateway';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Device } from './entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeviceDto } from './dtos/create-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  public async create(deviceData: CreateDeviceDto): Promise<Device> {
    try {
      const exists = await this.deviceRepository.findOne({
        where: { serialNumber: deviceData.serialNumber },
      });

      if (exists) {
        throw new BadRequestException(
          `Device with serial number ${deviceData.serialNumber} already exists`,
        );
      }

      const device = this.deviceRepository.create(deviceData);
      return await this.deviceRepository.save(device);
    } catch (error) {
      throw new BadRequestException(error.message || 'Error creating device');
    }
  }
  public async findAll(): Promise<Device[]> {
    return await this.deviceRepository.find({
      relations: ['metric', 'alerts'],
    });
  }

  public async findById(id: string): Promise<Device> {
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['metric', 'alerts'],
    });

    if (!device) {
      throw new BadRequestException('Device not found');
    }

    return device;
  }

  public async updateDeviceStatus(id: string): Promise<Device> {
    // Buscar el dispositivo
    const device = await this.findById(id);

    // Alternar el status
    device.status = device.status === 'online' ? 'offline' : 'online';

    // Guardar cambios en la base de datos
    const updatedDevice = await this.deviceRepository.save(device);

    // Notificar al frontend vía WebSocket
    this.notificationGateway.sendDeviceStatus(updatedDevice);

    return updatedDevice;
  }
}
