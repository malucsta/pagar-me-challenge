import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../errors/invalid-argument';

export enum PaymentMethodsEnum {
  creditCard = 1,
  debitCart = 2,
}

export class PaymentMethod {
  private readonly paymentMethod: number;

  private constructor(paymentMethod: number) {
    this.paymentMethod = paymentMethod;
    Object.freeze(this);
  }

  get value() {
    return this.paymentMethod;
  }

  private isValidPaymentMethod(paymentMethod: number): boolean {
    return paymentMethod in PaymentMethodsEnum;
  }

  static create(
    paymentMethod: number,
  ): Either<InvalidArgumentError, PaymentMethod> {
    const isValidMethodOrError = PaymentMethod.validate(paymentMethod);

    if (isValidMethodOrError.isLeft()) return left(isValidMethodOrError.value);

    return right(new PaymentMethod(paymentMethod));
  }

  static validate(
    paymentMethod: number,
  ): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new PaymentMethod(paymentMethod);

    if (!paymentMethod)
      return left(new InvalidArgumentError('Payment method cannot be null'));

    if (!thisClassInstance.isValidPaymentMethod(paymentMethod))
      return left(new InvalidArgumentError('Invalid payment method'));

    return right(true);
  }
}
