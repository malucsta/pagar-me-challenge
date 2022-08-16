import { Either, left, right } from '../../shared/either';
import { ClientData, ClientDataDTO } from './client-data';
import { Account } from './value objects/clientAccount';
import { Id } from './value objects/clientId';
import { Name } from './value objects/clientName';
import { InvalidArgumentError } from './errors/invalid-argument';

export class Client {
  public readonly id: Id;
  public readonly account: Account;
  public readonly name: Name;
  public readonly isActive: boolean;

  private constructor(id: Id, account: Account, name: Name, isActive: boolean) {
    this.id = id;
    this.account = account;
    this.name = name;
    this.isActive = isActive;
    Object.freeze(this);
  }

  static create(
    client: ClientDataDTO,
    id?: string,
  ): Either<InvalidArgumentError, Client> {
    const nameOrError = Name.create(client.name);
    if (nameOrError.isLeft()) return left(nameOrError.value);

    const accountOrError = Account.create(client.account);
    if (accountOrError.isLeft()) return left(accountOrError.value);

    if (client.isActive === null)
      return left(new InvalidArgumentError('Client status should be provided'));

    const idOrError = id ? Id.create(id) : Id.create();
    if (idOrError.isLeft()) return left(idOrError.value);

    const name = nameOrError.value;
    const account = accountOrError.value;
    const isActive = client.isActive;
    const clientId = idOrError.value;

    return right(new Client(clientId, account, name, isActive));
  }

  static constructValidClient(
    existingClient: ClientData,
    valuesToUpdate: ClientDataDTO,
  ): Either<InvalidArgumentError, Client> {
    const name = valuesToUpdate.name
      ? valuesToUpdate.name
      : existingClient.name.trim();

    const account = valuesToUpdate.account
      ? valuesToUpdate.account
      : existingClient.account.trim();

    const isActive =
      valuesToUpdate.isActive != null
        ? valuesToUpdate.isActive
        : existingClient.isActive;

    const clientOrError = Client.create(
      {
        account: account,
        name: name,
        isActive: isActive,
      },
      existingClient.id,
    );

    if (clientOrError.isLeft()) return left(clientOrError.value);

    return right(clientOrError.value);
  }
}
