import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { parse } from 'dotenv';
import * as Joi from '@hapi/joi';

import { IConfig } from './config.interface';

@Injectable()
export class ConfigService {
  private readonly envConfig: IConfig;

  constructor(filePath: string) {
    const config = JSON.parse(JSON.stringify(parse(readFileSync(filePath))));

    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: IConfig): IConfig {
    const envSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'demo'])
        .required(),
      PORT: Joi.number().default(7878),
      ELASTICSEARCH_PORT_NUMBER: Joi.number(),
      ELASTICSEARCH_BIND_ADDRESS: Joi.string(),
    });

    const { error, value } = Joi.validate(envConfig, envSchema);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
  }

  public get port() {
    return this.envConfig.PORT;
  }

  public get searchPort() {
    return this.envConfig.ELASTICSEARCH_PORT_NUMBER;
  }

  public get searchHost() {
    return this.envConfig.ELASTICSEARCH_BIND_ADDRESS;
  }

  public get searchNodeUrl() {
    return `http://${this.searchHost}:${this.searchPort}`;
  }
}
