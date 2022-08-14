import { ClientError, DomainError } from './errors-types';

export class InvalidIdError extends Error implements DomainError {
  status: string;
  constructor() {
    super('Invalid Id Format');
    this.status = ClientError.InvalidArguments;
  }
}
