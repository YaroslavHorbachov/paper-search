import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthorsModule } from './authors/authors.module';
import { SearchModule } from './search/search.module';
import { PapersModule } from './papers/papers.module';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [
    ConfigModule,
    SearchModule,
    AuthorsModule,
    PapersModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
