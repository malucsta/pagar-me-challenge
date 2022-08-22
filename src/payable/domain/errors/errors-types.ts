export enum PayableError {
  InvalidArguments = '400',
  InternalError = '500',
  PayableNotFound = '404',
}

export interface DomainError {
  message: string;
}
