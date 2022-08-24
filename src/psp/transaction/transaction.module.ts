import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/psp/client/client.module';
import { PayableModule } from '../payable/payable.module';
import { TransactionController } from './external/controllers/transaction.controller';
import { TransactionEntity } from './external/typeorm/entities/transaction.entity';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    ClientModule,
    PayableModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
