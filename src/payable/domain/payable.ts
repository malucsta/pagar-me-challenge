import { Either, left, right } from '../../shared/either';
import { InvalidArgumentError } from './errors/invalid-argument';
import { CreatePayableDataDTO, PayableDataDTO } from './payable-data';
import { Id } from './value-objects/id';
import { PaymentDate } from './value-objects/payment-date';
import { PayableStatus } from './value-objects/status';
import { Value } from './value-objects/value';

export class Payable {
  public readonly id: Id;
  public readonly value: Value;
  public readonly paymentDate: PaymentDate;
  public readonly status: PayableStatus;
  public readonly clientId: Id;
  public readonly transactionId: Id;

  private constructor(
    id: Id,
    value: Value,
    paymentDate: PaymentDate,
    status: PayableStatus,
    clientId: Id,
    transactionId: Id,
  ) {
    this.id = id;
    this.value = value;
    this.paymentDate = paymentDate;
    this.status = status;
    this.clientId = clientId;
    this.transactionId = transactionId;
    Object.freeze(this);
  }

  static create(
    payableData: PayableDataDTO | CreatePayableDataDTO,
    id?: string,
  ): Either<InvalidArgumentError, Payable> {
    const statusOrError = PayableStatus.create(payableData.status);
    if (statusOrError.isLeft()) return left(statusOrError.value);

    const statusValue = statusOrError.value.value;

    const value = Payable.adjustValueAccordingToPaymentMethod(
      statusValue,
      payableData.value,
    );

    const valueOrError = Value.create(value);
    if (valueOrError.isLeft()) return left(valueOrError.value);

    const paymentDateOrError = PaymentDate.create(
      Payable.returnPaymentDate(statusValue),
    );
    if (paymentDateOrError.isLeft()) return left(paymentDateOrError.value);

    const idOrError = id ? Id.create(id) : Id.create();
    if (idOrError.isLeft()) return left(idOrError.value);

    const clientIdOrError = Id.create(payableData.client);
    if (clientIdOrError.isLeft()) return left(clientIdOrError.value);

    const transactionIdOrError = Id.create(payableData.transaction);
    if (transactionIdOrError.isLeft()) return left(transactionIdOrError.value);

    const payableId = idOrError.value;
    const payableValue = valueOrError.value;
    const paymentDate = paymentDateOrError.value;
    const status = statusOrError.value;
    const clientId = clientIdOrError.value;
    const transactionId = transactionIdOrError.value;

    return right(
      new Payable(
        payableId,
        payableValue,
        paymentDate,
        status,
        clientId,
        transactionId,
      ),
    );
  }

  static adjustValueAccordingToPaymentMethod(status: number, value: number) {
    return (value * (100 - status)) / 100;
  }

  static returnPaymentDate(status: number) {
    const actualDate = new Date();
    switch (status) {
      case 3:
        return actualDate.toUTCString();

      case 5:
        return new Date(
          actualDate.setMonth(actualDate.getMonth() + 1),
        ).toUTCString();
    }
  }
}
