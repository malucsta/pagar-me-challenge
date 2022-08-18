import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../errors/invalid-argument';

export class CardOwner {
  public readonly cardOwner: string;

  private constructor(cardOwner: string) {
    this.cardOwner = cardOwner;
    Object.freeze(this);
  }

  private isValidLength(cardOwner: string): boolean {
    return cardOwner.trim().length > 0 && cardOwner.length < 255;
  }

  static create(cardOwner: string): Either<InvalidArgumentError, CardOwner> {
    const isValidDescriptionOrError = CardOwner.validate(cardOwner);

    if (isValidDescriptionOrError.isLeft())
      return left(isValidDescriptionOrError.value);

    return right(new CardOwner(cardOwner));
  }

  static validate(cardOwner: string): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new CardOwner(cardOwner);

    if (!cardOwner)
      return left(new InvalidArgumentError('Card owner cannot be null'));

    if (!thisClassInstance.isValidLength(cardOwner))
      return left(
        new InvalidArgumentError(
          'Card owner name is too long. Max length: 255',
        ),
      );

    return right(true);
  }
}
