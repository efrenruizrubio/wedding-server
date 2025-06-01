import { Body, Controller, Post } from '@nestjs/common';
import { WeddingApplicationService } from './wedding-application.service';
import { ApiTags } from '@nestjs/swagger';
import { WeddingApplicationDto } from './wedding-application.dto';

@ApiTags('wedding-application')
@Controller('wedding-application')
export class WeddingApplicationController {
  constructor(private readonly service: WeddingApplicationService) {}

  @Post()
  async create(@Body() payload: WeddingApplicationDto) {
    return this.service.create(payload);
  }
}
