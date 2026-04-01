import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private clientId: string;
  private clientSecret: string;
  private gmail: any;

  constructor(private readonly configService: ConfigService) {}

  async sendMail(options: {
    from?: string;
    to: string;
    cc?: string;
    replyTo?: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    return 'mock-id';
  }
}
