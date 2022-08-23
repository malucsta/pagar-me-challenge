import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/psp/client/client.module';
import { TransactionController } from './adapters/controllers/transaction.controller';
import { TransactionEntity } from './adapters/typeorm/entities/transaction.entity';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), ClientModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
