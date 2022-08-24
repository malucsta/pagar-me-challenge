import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayableController } from './external/controllers/payable.controller';
import { PayableEntity } from './external/typeorm/entities/payable.entity';
import { PayableService } from './services/payable.service';

@Module({
  imports: [TypeOrmModule.forFeature([PayableEntity])],
  controllers: [PayableController],
  providers: [PayableService],
  exports: [PayableService],
})
export class PayableModule {}
