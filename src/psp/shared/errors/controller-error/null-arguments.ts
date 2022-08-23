import { AdapterError, ControllerErrorCode } from './errors';

export class NullArgumentsError extends Error implements AdapterError {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = ControllerErrorCode.NullArguments;
  }
}
