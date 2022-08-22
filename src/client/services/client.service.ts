import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../adapters/typeorm/entities/client.entity';
import { Either, left, right } from '../../shared/either';
import { Id } from '../domain/value-objects/id';
import { InvalidArgumentError } from '../domain/errors/invalid-argument';
import { ClientNotFoundError } from '../domain/errors/client-not-found';
import { ClientData, ClientDataDTO } from '../domain/client-data';
import { Client } from '../domain/client';
import { UnexpectedError } from '../domain/errors/unexpected-error';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repository: Repository<ClientEntity>,
  ) {}

  async findById(
    id: string,
  ): Promise<Either<InvalidArgumentError | ClientNotFoundError, ClientData>> {
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

  async create(
    clientToCreate: ClientDataDTO,
  ): Promise<Either<InvalidArgumentError, ClientData>> {
    const clientOrError = Client.create(clientToCreate);

    if (clientOrError.isLeft()) return left(clientOrError.value);

    const client = clientOrError.value;

    const createdClient = await this.repository.save({
      id: client.id.value,
      name: client.name.value,
      account: client.account.value,
      isActive: client.isActive,
    });

    return right(createdClient);
  }

  async update(
    id: string,
    clientDataToUpdate: ClientDataDTO,
  ): Promise<
    Either<
      InvalidArgumentError | ClientNotFoundError | UnexpectedError,
      ClientData
    >
  > {
    //checks if client exists
    const clientOrError = await this.findById(id);
    if (clientOrError.isLeft()) return left(clientOrError.value);

    const existingClient = clientOrError.value;

    //returns client object with all valid fields
    const clientToUpdateOrError = Client.constructValidClient(
      existingClient,
      clientDataToUpdate,
    );
    if (clientToUpdateOrError.isLeft())
      return left(clientToUpdateOrError.value);

    const client = clientToUpdateOrError.value;

    const updatedClient = await this.repository.save({
      id: client.id.value,
      name: client.name.value,
      account: client.account.value,
      isActive: client.isActive,
    });

    if (!updatedClient)
      return left(
        new UnexpectedError('Something went wrong while updating client'),
      );

    return right(updatedClient);
  }
}
