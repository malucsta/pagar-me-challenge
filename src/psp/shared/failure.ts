export interface Failure<FailureType> {
  error: FailureType;
  subtype?: FailureType;
  message?: string;
}
