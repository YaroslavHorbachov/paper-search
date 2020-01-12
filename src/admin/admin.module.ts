import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ConfigModule } from '../config/config.module';
import { AdminBotService } from './admin-bot.service';
import { PapersModule } from '../papers/papers.module';
import { AuthorsModule } from '../authors/authors.module';
import { AdminUtilsService } from './admin-utils.service';

@Module({
  imports: [ConfigModule, PapersModule, AuthorsModule],
  providers: [AdminService, AdminBotService, AdminUtilsService],
  exports: [AdminService, AdminBotService],
})
export class AdminModule {}
