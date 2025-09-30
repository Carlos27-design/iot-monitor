import { Injectable } from '@nestjs/common';
import * as mailer from 'nodemailer';
@Injectable()
export class MailerConfigService {
  private transport: mailer.Transporter;
  constructor() {
    this.transport = mailer.createTransport({
      service: process.env.SERVICE_SMTP,
      auth: {
        user: process.env.USER_SMTP,
        pass: process.env.PASSWORD_SMTP,
      },
    });
  }

  public async sendEmail(options: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    return this.transport.sendMail(options);
  }
}
