import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../errors/invalid-argument';

export enum PayableStatusEnum {
  paid = 3,
  waiting_funds = 5,
}

export class PayableStatus {
  private readonly status: number;

  private constructor(status: number) {
    this.status = status;
    Object.freeze(this);
  }

  get value() {
    return this.status;
  }

  private isValidPayableStatus(status: number): boolean {
    return status in PayableStatusEnum;
  }

  static create(status: number): Either<InvalidArgumentError, PayableStatus> {
    const isValidMethodOrError = PayableStatus.validate(status);

    if (isValidMethodOrError.isLeft()) return left(isValidMethodOrError.value);

    return right(new PayableStatus(status));
  }

  static validate(status: number): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new PayableStatus(status);

    if (!status)
      return left(new InvalidArgumentError('Payable status cannot be null'));

    if (!thisClassInstance.isValidPayableStatus(status))
      return left(new InvalidArgumentError('Invalid payable status'));

    return right(true);
  }
}
