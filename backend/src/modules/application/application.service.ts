import { Injectable } from '@nestjs/common';
import { GenericService } from '@modules/generic/generic.service';
import { Application } from './application.entity';

@Injectable()
export class ApplicationService extends GenericService(Application) {
  constructor() {
    super();
  }
}
