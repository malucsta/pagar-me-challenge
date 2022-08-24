import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './external/controllers/client.controller';
import { ClientEntity } from './external/typeorm/entities/client.entity';
import { ClientService } from './services/client.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
