import { upOne, IDockerComposeOptions } from 'docker-compose';
import { indexOf } from 'lodash';
import { join, sep } from 'path';
import { readFileSync } from 'fs';
import { parse } from 'dotenv';

// @deprecated TODO: Need to add health-check
class AppBootService {
  private SERVICE_DIR = 'paper-search';
  private DOCKER_DIR = 'containers';
  private DOCKER_ELASTIC_SERVICE_DIR = 'elastic';
  private DOCKER_ENV_FILE = '.env';
  private DOCKER_ELASTIC_CONTAINER_NAME = 'elastic';
  private DOCKER_ELASTIC_CONTAINER_DIRECTORY = this.getRunningDirectory();
  private DOCKER_CONFIG: IDockerComposeOptions = {
    log: true,
    cwd: this.DOCKER_ELASTIC_CONTAINER_DIRECTORY,
    env: parse(
      readFileSync(
        join(this.DOCKER_ELASTIC_CONTAINER_DIRECTORY, this.DOCKER_ENV_FILE),
      ),
    ),
  };

  public static async boot() {
    const bootService = new AppBootService();
    try {
      await bootService.bootstrapElasticService();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  private bootstrapElasticService() {
    return upOne(this.DOCKER_ELASTIC_CONTAINER_NAME, this.DOCKER_CONFIG);
  }

  private getRunningDirectory() {
    const dirnames = __dirname.split(sep);
    const appServiceDeepLevel = indexOf(dirnames, this.SERVICE_DIR);

    if (!appServiceDeepLevel) {
      throw null;
    }

    return join(
      ...dirnames.slice(0, appServiceDeepLevel),
      this.DOCKER_DIR,
      this.DOCKER_ELASTIC_SERVICE_DIR,
    );
  }
}

AppBootService.boot();
