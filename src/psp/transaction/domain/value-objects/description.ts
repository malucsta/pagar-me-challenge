import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../../../shared/errors/invalid-argument';

export class Description {
  private readonly description: string;

  private constructor(description: string) {
    this.description = description;
    Object.freeze(this);
  }

  get value() {
    return this.description;
  }

  private isValidLength(description: string): boolean {
    return description.trim().length > 0 && description.length <= 512;
  }

  static create(
    description: string,
  ): Either<InvalidArgumentError, Description> {
    const isValidDescriptionOrError = Description.validate(description);

    if (isValidDescriptionOrError.isLeft())
      return left(isValidDescriptionOrError.value);

    return right(new Description(description));
  }

  static validate(description: string): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new Description(description);

    if (!description)
      return left(new InvalidArgumentError('Description cannot be null'));

    if (!thisClassInstance.isValidLength(description))
      return left(
        new InvalidArgumentError('Description is too long. Max length: 512'),
      );

    return right(true);
  }
}
