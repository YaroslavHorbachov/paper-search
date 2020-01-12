import { Injectable } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { ConfigService } from './config/config.service';
import { AdminService } from './admin/admin.service';

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService,
    private readonly admin: AdminService,
  ) {}

  public getRoot(): Observable<string> {
    return of(`Paper Search: ${this.config.port}`);
  }
}
