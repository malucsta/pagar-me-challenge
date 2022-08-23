import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './psp/client/client.module';
import config from '../config/ormconfig';
import { TransactionModule } from './psp/transaction/transaction.module';
import { PayableModule } from './psp/payable/payable.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ClientModule,
    TransactionModule,
    PayableModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
