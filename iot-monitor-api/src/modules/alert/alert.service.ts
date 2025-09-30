import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './alert.entity';
import { Between, Repository } from 'typeorm';
import { NotificationGateway } from '../notification/notification.gateway';

import { MailerConfigService } from '../mailer-config/mailer-config.service';
import { AuthService } from '../auth/auth.service';

interface Periodo {
  start: Date;
  end: Date;
}

@Injectable()
export class AlertService implements OnModuleInit {
  private alertCheckInterval: NodeJS.Timeout;
  private sentAlertIds = new Set<number>(); // <-- registro en memoria

  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    private readonly notificationGateway: NotificationGateway,
    private readonly mailerService: MailerConfigService,
    private readonly authService: AuthService,
  ) {}

  async onModuleInit() {
    // Revisión periódica cada minuto
    this.alertCheckInterval = setInterval(
      () => this.sendCriticalAlerts(),
      60_000,
    );
  }

  onModuleDestroy() {
    if (this.alertCheckInterval) clearInterval(this.alertCheckInterval);
  }

  private async sendCriticalAlerts() {
    // 1️⃣ Traer todas las alertas con sus relaciones
    const alerts = await this.alertRepository.find({
      relations: ['device', 'metric'],
      order: { createdAt: 'ASC' },
    });

    // 2️⃣ Filtrar solo las alertas críticas y no enviadas en memoria
    const criticalAlerts = alerts.filter((alert) => {
      const metric = alert.metric;
      if (!metric) return false;

      const isCritical =
        (metric.metric === 'battery' && metric.valueNum < 20) ||
        (metric.metric === 'temperature' &&
          (metric.valueNum < 5 || metric.valueNum > 30)) ||
        (metric.metric === 'humidity' &&
          (metric.valueNum < 20 || metric.valueNum > 50));

      return isCritical && !this.sentAlertIds.has(alert.id);
    });

    if (!criticalAlerts.length) return;

    const users = await this.authService.findAll();

    // 3️⃣ Enviar correos
    for (const alert of criticalAlerts) {
      for (const user of users) {
        try {
          await this.mailerService.sendEmail({
            from: process.env.USER_SMTP!,
            to: user.email,
            subject: alert.message,
            text: alert.message,
            html: `
              <h1>${alert.message}</h1>
              <p>Dispositivo: ${alert.device?.serialNumber}</p>
              <p>Severidad: ${alert.severety}</p>
            `,
          });
        } catch (error) {
          console.error('Error enviando correo:', error);
        }
      }

      // 4️⃣ Marcar alerta como enviada en memoria
      this.sentAlertIds.add(alert.id);
    }
  }

  // Métodos normales
  public async findAll(): Promise<Alert[]> {
    return await this.alertRepository.find({ relations: ['device', 'metric'] });
  }

  public async findById(id: number): Promise<Alert> {
    const alert = await this.alertRepository.findOne({
      where: { id },
      relations: ['device', 'metric'],
    });
    if (!alert) throw new BadRequestException('Alert not found');
    return alert;
  }

  public async findByDeviceId(deviceId: string): Promise<Alert[]> {
    return await this.alertRepository
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.device', 'device')
      .leftJoinAndSelect('alert.metric', 'metric')
      .where('device.id = :deviceId', { deviceId })
      .orderBy('alert.createdAt', 'DESC')
      .getMany();
  }

  public async findByDeviceIdAndPeriodo(deviceId: string, periodo: Periodo) {
    return await this.alertRepository.find({
      where: {
        device: { id: deviceId },
        createdAt: Between(periodo.start, periodo.end),
      },
      order: { createdAt: 'DESC' },
      relations: ['device', 'metric'],
    });
  }
}
