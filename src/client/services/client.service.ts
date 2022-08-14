import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../client';
import { ClientEntity } from '../entities/client.entity';
import { Either, left, right } from '../../shared/either';
import { Id } from '../domain/clientId';
import { InvalidIdError } from '../domain/errors/invalid-id';
import { ClientNotFoundError } from '../domain/errors/client-not-found';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repository: Repository<ClientEntity>,
  ) {}

  async findById(
    id: string,
  ): Promise<Either<InvalidIdError | ClientNotFoundError, Client>> {
    const isValidIdOrError = Id.validate(id);

    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const client = await this.repository.findOne({
      where: {
        id: id,
      },
    });

    if (!client) return left(new ClientNotFoundError(id));

    return right(client);
  }
}
