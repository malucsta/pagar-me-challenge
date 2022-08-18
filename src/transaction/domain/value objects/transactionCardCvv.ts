import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../errors/invalid-argument';

export class CardCvv {
  public readonly cardCvv: string;

  private constructor(cardCvv: string) {
    this.cardCvv = cardCvv;
    Object.freeze(this);
  }

  private isValidCvv(cardCvv: string): boolean {
    return cardCvv.length === 3 && /^\d+$/.test(cardCvv);
  }

  static create(cardCvv: string): Either<InvalidArgumentError, CardCvv> {
    const isValidCvvOrError = CardCvv.validate(cardCvv);

    if (isValidCvvOrError.isLeft()) return left(isValidCvvOrError.value);

    return right(new CardCvv(cardCvv));
  }

  static validate(cardCvv: string): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new CardCvv(cardCvv);

    if (!cardCvv)
      return left(new InvalidArgumentError('Card cvv cannot be null'));

    if (!thisClassInstance.isValidCvv(cardCvv))
      return left(
        new InvalidArgumentError(
          'Card cvv must only have numeric symbols and 3 digits',
        ),
      );

    return right(true);
  }
}
