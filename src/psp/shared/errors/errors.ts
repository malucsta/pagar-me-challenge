export enum DomainErrorCode {
  InvalidArgument = '400',
  InternalError = '500',
  EntityNotFound = '404',
}

export interface DomainError {
  message: string;
}
