export enum PayableError {
  InvalidArguments = '400',
  InternalError = '500',
  ClientNotFound = '404',
}

export interface DomainError {
  message: string;
}
