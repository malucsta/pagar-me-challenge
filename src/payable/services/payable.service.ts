import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayableEntity } from '../adapters/typeorm/entities/payable.entity';

@Injectable()
export class PayableService {
  constructor(
    @InjectRepository(PayableEntity)
    private readonly repository: Repository<PayableEntity>,
  ) {}
}
