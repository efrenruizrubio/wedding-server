import { Controller } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { GenericController } from '@modules/generic/generic.controller';
import { Application } from './application.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('application')
@ApiBearerAuth()
@Controller('application')
export class ApplicationController extends GenericController(Application) {
  constructor(private readonly applicationService: ApplicationService) {
    super();
  }
}
