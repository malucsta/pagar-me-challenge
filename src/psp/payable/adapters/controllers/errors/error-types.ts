export interface AdapterError {
  message: string;
}

export enum ControllerError {
  NullArguments = '400',
  InternalError = '500',
}
