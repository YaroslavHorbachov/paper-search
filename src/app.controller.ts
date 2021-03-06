import { Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getRoot(): Observable<string> {
    return this.appService.getRoot();
  }
}
