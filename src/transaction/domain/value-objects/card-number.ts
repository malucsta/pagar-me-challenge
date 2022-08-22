import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../errors/invalid-argument';

export class CardNumber {
  private readonly cardNumber: string;

  private constructor(description: string) {
    this.cardNumber = description;
    Object.freeze(this);
  }

  get value() {
    return this.cardNumber;
  }

  private isValidCardNumber(cardNumber: string): boolean {
    return (
      cardNumber.trim().length > 0 &&
      cardNumber.length > 4 &&
      /^\d+$/.test(cardNumber)
    );
  }

  static create(cardNumber: string): Either<InvalidArgumentError, CardNumber> {
    const isValidDescriptionOrError = CardNumber.validate(cardNumber);

    if (isValidDescriptionOrError.isLeft())
      return left(isValidDescriptionOrError.value);

    const numberToStore = cardNumber.substring(
      cardNumber.length - 4,
      cardNumber.length,
    );

    return right(new CardNumber(numberToStore));
  }

  static validate(cardNumber: string): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new CardNumber(cardNumber);

    if (!cardNumber)
      return left(new InvalidArgumentError('Card number cannot be null'));

    if (!thisClassInstance.isValidCardNumber(cardNumber))
      return left(
        new InvalidArgumentError(
          'Card numbers must only have numeric symbols and more than 4 digits. Please provide a valid card number',
        ),
      );

    return right(true);
  }
}
