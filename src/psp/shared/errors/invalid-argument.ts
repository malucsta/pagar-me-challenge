import { DomainErrorCode, DomainError } from './errors';

export class InvalidArgumentError extends Error implements DomainError {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = DomainErrorCode.InvalidArgument;
  }
}
