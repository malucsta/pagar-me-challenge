import { Either, left, right } from '../../shared/either';
import { InvalidArgumentError } from './errors/invalid-argument';
import { TransactionDataDTO } from './transaction-data';
import { CardCvv } from './value objects/transactionCardCvv';
import { CardExpirationDate } from './value objects/transactionCardExpirationDate';
import { CardNumber } from './value objects/transactionCardNumber';
import { CardOwner } from './value objects/transactionCardOwner';
import { Description } from './value objects/transactionDescription';
import { Id } from './value objects/transactionId';
import { PaymentMethod } from './value objects/transactionMethod';
import { Value } from './value objects/transactionValue';

export class Transaction {
  public readonly id: Id;
  public readonly description: Description;
  public readonly paymentMethod: PaymentMethod;
  public readonly value: Value;
  public readonly cardNumber: CardNumber;
  public readonly cardOwner: CardOwner;
  public readonly cardExpirationDate: CardExpirationDate;
  public readonly cardCvv: CardCvv;
  public readonly clientId: Id;

  private constructor(
    id: Id,
    description: Description,
    paymentMethod: PaymentMethod,
    value: Value,
    cardNumber: CardNumber,
    cardOwner: CardOwner,
    cardExpirationDate: CardExpirationDate,
    cardCvv: CardCvv,
    clientId: Id,
  ) {
    this.id = id;
    this.description = description;
    this.paymentMethod = paymentMethod;
    this.value = value;
    this.cardNumber = cardNumber;
    this.cardOwner = cardOwner;
    this.cardExpirationDate = cardExpirationDate;
    this.cardCvv = cardCvv;
    this.clientId = clientId;
    Object.freeze(this);
  }

  static create(
    transactionData: TransactionDataDTO,
    id?: string,
  ): Either<InvalidArgumentError, Transaction> {
    const descriptionOrError = Description.create(transactionData.description);
    if (descriptionOrError.isLeft()) return left(descriptionOrError.value);

    const paymentMethodOrError = PaymentMethod.create(
      transactionData.paymentMethod,
    );
    if (paymentMethodOrError.isLeft()) return left(paymentMethodOrError.value);

    const valueOrError = Value.create(transactionData.value);
    if (valueOrError.isLeft()) return left(valueOrError.value);

    const cardNumberOrError = CardNumber.create(transactionData.cardNumber);
    if (cardNumberOrError.isLeft()) return left(cardNumberOrError.value);

    const cardOwnerOrError = CardOwner.create(transactionData.cardOwner);
    if (cardOwnerOrError.isLeft()) return left(cardOwnerOrError.value);

    const cardExpirationDateOrError = CardExpirationDate.create(
      transactionData.cardExpirationDate,
    );
    if (cardExpirationDateOrError.isLeft())
      return left(cardExpirationDateOrError.value);

    const cardCvvOrError = CardCvv.create(transactionData.cardCvv);
    if (cardCvvOrError.isLeft()) return left(cardCvvOrError.value);

    const clientIdOrError = Id.create(transactionData.client);
    if (clientIdOrError.isLeft()) return left(clientIdOrError.value);

    const idOrError = id ? Id.create(id) : Id.create();
    if (idOrError.isLeft()) return left(idOrError.value);

    const transactionId = idOrError.value;
    const description = descriptionOrError.value;
    const paymentMethod = paymentMethodOrError.value;
    const value = valueOrError.value;
    const cardNumber = cardNumberOrError.value;
    const cardOwner = cardOwnerOrError.value;
    const cardExpirationDate = cardExpirationDateOrError.value;
    const cardCvv = cardCvvOrError.value;
    const clientId = clientIdOrError.value;

    return right(
      new Transaction(
        transactionId,
        description,
        paymentMethod,
        value,
        cardNumber,
        cardOwner,
        cardExpirationDate,
        cardCvv,
        clientId,
      ),
    );
  }
}
