import { Module } from '@nestjs/common';
import { DeviceModule } from './device/device.module';

import { AlertModule } from './alert/alert.module';

import { DeviceMetricModule } from './device-metric/device-metric.module';

import { MailerConfigModule } from './mailer-config/mailer-config.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DeviceModule,
    DeviceMetricModule,
    AlertModule,
    AuthModule,
    MailerConfigModule,
  ],
})
export class ModulesModule {}
