import { Module } from '@nestjs/common';
import { MailerConfigService } from './mailer-config.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  exports: [MailerConfigService],
  providers: [MailerConfigService],
})
export class MailerConfigModule {}
