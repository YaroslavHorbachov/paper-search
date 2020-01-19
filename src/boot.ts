import { readFileSync } from 'fs';
import { join } from 'path';
import ms from 'ms';
import { parse } from 'dotenv';
import { upOne, IDockerComposeOptions } from 'docker-compose';
import { interval, timer, concat, from, merge, Subject } from 'rxjs';
import { retry, takeUntil, map, tap, exhaustMap } from 'rxjs/operators';
import { Client } from '@elastic/elasticsearch';

export class AppBootService {
  private readonly esClient = new Client({ node: `http://localhost:9266` }); // TODO: Need to reuse config module

  private readonly DEFAULT_HEALTH_CHECK_INTERVAL = 250;

  private readonly DOCKER_ENV_FILE = '.env';

  private readonly DOCKER_ELASTIC_CONTAINER_NAME = 'elastic';

  private readonly DOCKER_ELASTIC_CONTAINER_DIRECTORY = './containers/elastic';

  private readonly DOCKER_CONFIG: IDockerComposeOptions = {
    log: true,
    cwd: this.DOCKER_ELASTIC_CONTAINER_DIRECTORY,
    env: parse(
      readFileSync(
        join(this.DOCKER_ELASTIC_CONTAINER_DIRECTORY, this.DOCKER_ENV_FILE),
      ),
    ),
  };

  private readonly stableElasticService = new Subject();

  private readonly stableElasticService$ = this.stableElasticService
    .asObservable()
    // tslint:disable-next-line: no-console
    .pipe(tap(() => console.log('Elastic service is ready')));

  public static boot() {
    const bootService = new AppBootService();

    // TODO: Add redis, mongodb bootstrap
    return bootService.bootstrapElasticService();
  }

  private bootstrapElasticService() {
    return concat(
      this.upElasticServiceContainer(),
      this.healthCheckElasticService(),
    );
  }

  private upElasticServiceContainer() {
    return from(
      upOne(this.DOCKER_ELASTIC_CONTAINER_NAME, this.DOCKER_CONFIG),
    ).pipe(
      map(({ exitCode }) => {
        if (exitCode) {
          throw new Error(
            `${this.DOCKER_ELASTIC_CONTAINER_NAME} Failed, Code ${exitCode}.`,
          );
        }
      }),
    );
  }

  private healthCheckElasticService() {
    return interval(this.DEFAULT_HEALTH_CHECK_INTERVAL)
      .pipe(
        exhaustMap(() => this.esClient.ping()), // TODO: Need to reuse search module
        retry(),
        takeUntil(merge(timer(ms('30s')), this.stableElasticService$)),
      )
      .pipe(tap(() => this.stableElasticService.next()));
  }
}
