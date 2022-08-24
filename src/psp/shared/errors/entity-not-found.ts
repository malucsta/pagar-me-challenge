import { DomainErrorCode, DomainError } from './errors';

export class EntityNotFoundError extends Error implements DomainError {
  status: string;
  constructor(id?: string) {
    id
      ? super(`The client with id ${id} doesn't exist`)
      : super('No entities found');
    this.status = DomainErrorCode.EntityNotFound;
  }
}
