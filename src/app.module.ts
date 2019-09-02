import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthorsModule } from './authors/authors.module';
import { SearchModule } from './search/search.module';
import { PapersModule } from './papers/papers.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
