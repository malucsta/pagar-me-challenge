import { ClientError, DomainError } from './errors-types';

export class UnexpectedError extends Error implements DomainError {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = ClientError.InternalError;
  }
}
