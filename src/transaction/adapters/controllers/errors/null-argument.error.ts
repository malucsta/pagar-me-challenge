import { AdapterError, ControllerError } from './error-types';

export class NullArgumentsError extends Error implements AdapterError {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = ControllerError.NullArguments;
  }
}
