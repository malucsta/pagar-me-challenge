import { DomainError, TransactionError } from './errors-types';

export class TransactionNotFoundError extends Error implements DomainError {
  status: string;
  constructor(id?: string) {
    id
      ? super(`Transaction with id ${id} doesn't exist`)
      : super('No transaction found');
    this.status = TransactionError.TransactionNotFound;
  }
}
