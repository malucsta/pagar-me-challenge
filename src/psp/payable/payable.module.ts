import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayableController } from './adapters/controllers/payable.controller';
import { PayableEntity } from './adapters/typeorm/entities/payable.entity';
import { PayableService } from './services/payable.service';

@Module({
  imports: [TypeOrmModule.forFeature([PayableEntity])],
  controllers: [PayableController],
  providers: [PayableService],
  exports: [PayableService],
})
export class PayableModule {}
