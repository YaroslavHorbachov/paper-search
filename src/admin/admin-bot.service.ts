import { Injectable } from '@nestjs/common';

import * as TelegramBot from 'node-telegram-bot-api';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AdminBotService {
  public readonly bot = new TelegramBot(this.config.botToken, {
    polling: true,
  });

  constructor(private readonly config: ConfigService) {}

  public sendMessage(id: number, msg: string) {
    return this.bot.sendMessage(id, msg);
  }
}
