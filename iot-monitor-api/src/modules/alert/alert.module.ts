import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './alert.entity';
import { NotificationModule } from '../notification/notification.module';
import { DeviceMetricModule } from '../device-metric/device-metric.module';
import { MailerConfigModule } from '../mailer-config/mailer-config.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert]),
    NotificationModule,
    MailerConfigModule,
    DeviceMetricModule,
    AuthModule,
  ],
  controllers: [AlertController],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}
