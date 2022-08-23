import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../../../shared/errors/invalid-argument';

export class Name {
  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
    Object.freeze(this);
  }

  get value() {
    return this.name;
  }

  private isValidFormat(name: string): boolean {
    return name
      .split(' ')
      .map((string) => {
        return /^[a-zA-Z\u00C0-\u00FF']+$/.test(string);
      })
      .every((x) => x === true);
  }

  private isValidLength(name: string): boolean {
    return name.length < 255;
  }

  static create(name: string): Either<InvalidArgumentError, Name> {
    const isValidOrError = Name.validate(name);

    if (isValidOrError.isLeft()) return left(isValidOrError.value);

    return right(new Name(name));
  }

  static validate(name: string): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new Name(name);

    if (!name) return left(new InvalidArgumentError('Name cannot be null'));

    if (!thisClassInstance.isValidFormat(name))
      return left(
        new InvalidArgumentError(
          'Name cannot be empty string and should only contain letters',
        ),
      );

    if (!thisClassInstance.isValidLength(name))
      return left(
        new InvalidArgumentError('Name is too long. Max length: 255'),
      );

    return right(true);
  }
}
