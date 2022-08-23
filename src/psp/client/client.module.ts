import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './adapters/controllers/client.controller';
import { ClientEntity } from './adapters/typeorm/entities/client.entity';
import { ClientService } from './services/client.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
