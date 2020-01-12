import { Injectable } from '@nestjs/common';
import { Message } from 'node-telegram-bot-api';
import { AdminBotService } from './admin-bot.service';
import { PapersService } from '../papers/papers.service';
import { AuthorsService } from '../authors/authors.service';
import { PAPER_CREATED_TEXT } from './admin.constants';
import { Paper } from '../papers/paper';
import { AdminUtilsService } from './admin-utils.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminBot: AdminBotService,
    private readonly papersService: PapersService,
    private readonly authorsService: AuthorsService,
    private readonly adminUtilsService: AdminUtilsService,
  ) {
    this.adminBot.bot.on('message', this.handlePaper);
    this.adminBot.bot.on('edited_message', this.handlePaper);
  }

  private handlePaper = async (msg: Message) => {
    const { chat, message_id } = msg;

    const paper = await this.papersService.findPaperByMessageId(message_id);

    paper
      ? await this.handleUpdatePaper(paper, msg)
      : await this.handleCreatePaper(msg);

    return this.adminBot.sendMessage(chat.id, PAPER_CREATED_TEXT);
  };

  private handleUpdatePaper = async (paper: Paper, msg: Message) => {
    const { text, edit_date, chat, message_id } = msg;

    this.papersService.updatePaper(paper.id, {
      ...paper,
      updatedOn: this.adminUtilsService.getDate(edit_date),
      content: text,
      title: this.adminUtilsService.getTitle(message_id, chat),
    });
  };

  private handleCreatePaper = async ({
    chat,
    message_id,
    text,
    date,
  }: Message) => {
    const title = this.adminUtilsService.getTitle(message_id, chat);
    const createdOn = this.adminUtilsService.getDate(date);

    return this.papersService.createPaper({
      messageId: message_id,
      content: text,
      title,
      createdOn,
    });
  };
}
