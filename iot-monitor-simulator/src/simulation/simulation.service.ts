// simulation.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/device/device.entity';
import { DeviceMetric } from 'src/deviceMetric/device-metric.entity';
import { Alert } from 'src/alert/alert.entity';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { initialData } from 'data/device.data';

interface DeviceState {
  temperature: number;
  humidity: number;
  battery: number;
}

@Injectable()
export class SimulationService implements OnModuleInit, OnModuleDestroy {
  private devices: Device[] = [];
  private deviceState: Map<string, DeviceState> = new Map();
  private simulationInterval: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 50;

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
    @InjectRepository(DeviceMetric)
    private readonly metricRepo: Repository<DeviceMetric>,
    @InjectRepository(Alert)
    private readonly alertRepo: Repository<Alert>,

    private readonly notificationGateway: NotificationGateway,
  ) {}

  async onModuleInit() {
    try {
      const devices = initialData.devices;

      const existingDevice = await this.deviceRepo.count();

      if (existingDevice === 0) {
        await this.deviceRepo.save(devices);
      }

      this.devices = await this.deviceRepo.find();

      for (const device of this.devices) {
        this.deviceState.set(device.id, {
          temperature: this.randomFloat(20, 25),
          humidity: this.randomFloat(40, 60),
          battery: this.randomFloat(80, 100),
        });
      }
      if (this.devices.length > 0) {
        this.startSimulationLoop();
      }
    } catch (error) {}
  }

  private async startSimulationLoop() {
    if (this.simulationInterval) return;

    this.simulationInterval = setInterval(async () => {
      for (let i = 0; i < this.devices.length; i += this.BATCH_SIZE) {
        const batch = this.devices.slice(i, i + this.BATCH_SIZE);
        await Promise.all(
          batch.map(async (device) => {
            if (device.status !== 'online') return;

            const temperature = this.randomFloat(20, 25);
            const humidity = this.randomFloat(40, 60);
            const battery = this.randomFloat(80, 100);
            this.deviceState.set(device.id, { temperature, humidity, battery });

            const metrics = [
              { device, metric: 'temperature', valueNum: temperature },
              { device, metric: 'humidity', valueNum: humidity },
              { device, metric: 'battery', valueNum: battery },
            ];

            for (const m of metrics) {
              const savedMetric = await this.metricRepo.save({
                device,
                metric: m.metric,
                valueNum: m.valueNum,
              });

              this.notificationGateway.sendMetric(savedMetric);

              // Alertas

              if (
                savedMetric.metric === 'battery' &&
                savedMetric.valueNum < 20
              ) {
                await this.alertRepo.save({
                  device: savedMetric.device,
                  metric: savedMetric,
                  message: 'Batería baja',
                  severety: 'medium',
                  alertType: 'battery',
                  resolved: false,
                });
              }

              if (
                savedMetric.metric === 'temperature' &&
                (m.valueNum < 5 || m.valueNum > 30)
              ) {
                await this.alertRepo.save({
                  device: savedMetric.device,
                  metric: savedMetric,
                  message: 'Temperatura fuera del rango seguro',
                  severety: 'high',
                  alertType: 'temperature',
                  resolved: false,
                });
              }

              if (
                savedMetric.metric === 'humidity' &&
                (m.valueNum < 20 || m.valueNum > 50)
              ) {
                await this.alertRepo.save({
                  device: savedMetric.device,
                  metric: savedMetric,
                  message: 'Humedad fuera del rango seguro',
                  severety: 'medium',
                  alertType: 'humidity',
                  resolved: false,
                });
              }
            }
          }),
        );
      }
    }, 5000);
  }

  onModuleDestroy() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
  }

  private randomFloat(min: number, max: number) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }
}
