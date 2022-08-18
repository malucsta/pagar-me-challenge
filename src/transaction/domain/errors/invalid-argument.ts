import { DomainError, TransactionError } from './errors-types';

export class InvalidArgumentError extends Error implements DomainError {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = TransactionError.InvalidArguments;
  }
}
