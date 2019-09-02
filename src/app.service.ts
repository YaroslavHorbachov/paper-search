import { Injectable } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getRoot(): Observable<string> {
    return of(`Paper Search: ${this.config.port}`);
  }
}
