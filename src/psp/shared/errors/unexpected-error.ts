import { DomainErrorCode, DomainError } from './errors';

export class UnexpectedError extends Error implements DomainError {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = DomainErrorCode.InternalError;
  }
}
