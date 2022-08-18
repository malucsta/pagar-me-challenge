export enum TransactionError {
  InvalidArguments = '400',
  InternalError = '500',
  TransactionNotFound = '404',
}

export interface DomainError {
  message: string;
}
