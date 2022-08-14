import { ClientError, DomainError } from './errors-types';

export class ClientNotFoundError extends Error implements DomainError {
  status: string;
  constructor(id: string) {
    super(`The client with id ${id} doesn't exist`);
    this.status = ClientError.ClientNotFound;
  }
}
