export interface AdapterError {
  message: string;
}

export enum ControllerErrorCode {
  NullArguments = '400',
  InternalError = '500',
}
