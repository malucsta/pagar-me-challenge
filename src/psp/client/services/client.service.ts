import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../external/typeorm/entities/client.entity';
import { Either, left, right } from '../../shared/either';
import { Id } from '../../shared/value-objects/id';
import { InvalidArgumentError } from '../../shared/errors/invalid-argument';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found';
import { ClientData, ClientDataDTO } from '../domain/client-data';
import { Client } from '../domain/client';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repository: Repository<ClientEntity>,
  ) {}

  async findById(
    id: string,
  ): Promise<Either<InvalidArgumentError | EntityNotFoundError, ClientData>> {
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const client = await this.repository.findOne({
      where: {
        id: id,
      },
    });

    if (!client) return left(new EntityNotFoundError(id));

    return right(client);
  }

  async create(
    clientToCreate: ClientDataDTO,
  ): Promise<Either<InvalidArgumentError, ClientData>> {
    const clientOrError = Client.create(clientToCreate);
    if (clientOrError.isLeft()) return left(clientOrError.value);

    const client = Client.mapObjectToValues(clientOrError.value);

    const createdClient = await this.repository.save(client);
    return right(createdClient);
  }

  async update(
    id: string,
    clientDataToUpdate: ClientDataDTO,
  ): Promise<Either<InvalidArgumentError | EntityNotFoundError, ClientData>> {
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

    const client = Client.mapObjectToValues(clientToUpdateOrError.value);

    const updatedClient = await this.repository.save(client);

    return right(updatedClient);
  }
}
