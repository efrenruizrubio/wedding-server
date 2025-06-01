import { Injectable } from '@nestjs/common';

import { MailService } from '@modules/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { WeddingApplication } from './wedding-application.entity';
import { WeddingApplicationDto } from './wedding-application.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WeddingApplicationService {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(WeddingApplication) private readonly repo: Repository<WeddingApplication>,
  ) {}

  async create(payload: WeddingApplicationDto) {}
}
