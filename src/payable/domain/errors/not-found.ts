import { DomainError, PayableError } from './errors-types';

export class PayableNotFoundError extends Error implements DomainError {
  status: string;
  constructor(id?: string) {
    id
      ? super(`Payable with id ${id} doesn't exist`)
      : super('No payables found');
    this.status = PayableError.PayableNotFound;
  }
}
