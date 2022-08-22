import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../errors/invalid-argument';

export class PaymentDate {
  private readonly paymentDate: string;

  private constructor(paymentDate: string) {
    this.paymentDate = new Date(paymentDate).toUTCString();
    Object.freeze(this);
  }

  get value() {
    return this.paymentDate;
  }

  static create(
    paymentDate: string,
  ): Either<InvalidArgumentError, PaymentDate> {
    const isValidDateOrError = PaymentDate.validate(paymentDate);
    if (isValidDateOrError.isLeft()) return left(isValidDateOrError.value);

    return right(new PaymentDate(paymentDate));
  }

  static validate(paymentDate: string): Either<InvalidArgumentError, boolean> {
    if (!paymentDate)
      return left(new InvalidArgumentError('Payment date cannot be null'));

    const date = new Date(paymentDate);

    if (!date.getFullYear())
      return left(new InvalidArgumentError('Payment date is invalid'));

    const actualDate = new Date();
    const isValidYear = date.getFullYear() >= actualDate.getFullYear();

    if (!isValidYear) return left(new InvalidArgumentError('Invalid year'));

    if (isValidYear && date.getMonth() < actualDate.getMonth())
      return left(new InvalidArgumentError('Invalid month'));

    return right(true);
  }
}
