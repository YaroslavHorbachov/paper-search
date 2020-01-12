import { Injectable } from '@nestjs/common';
import { Chat } from 'node-telegram-bot-api';
import { unix } from 'moment';

@Injectable()
export class AdminUtilsService {
  public getTitle(messageId: number, chat: Chat) {
    return chat.title || `${chat.username} #${messageId}`;
  }

  public getDate(date: number) {
    return unix(date).toDate();
  }
}
