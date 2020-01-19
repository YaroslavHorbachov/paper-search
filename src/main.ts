import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

import { ConfigService } from './config/config.service';
import { AppModule } from './app.module';
import { AppBootService } from './boot';
import { concat, defer } from 'rxjs';

declare const module: any;
class App {
  public static async main() {
    const app = new App();

    concat(AppBootService.boot(), defer(app.bootstrap)).subscribe();
  }

  private async bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);

    app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
    app.use(compression());

    await app.listen(config.port);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  }
}

App.main();
