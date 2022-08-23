import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../../../shared/errors/invalid-argument';

export class Value {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
    Object.freeze(this);
  }

  get getValue() {
    return this.value;
  }

  private isValidValue(value: number): boolean {
    return value > 0;
  }

  static create(value: number): Either<InvalidArgumentError, Value> {
    const isValidValueOrError = Value.validate(value);

    if (isValidValueOrError.isLeft()) return left(isValidValueOrError.value);

    return right(new Value(value));
  }

  static validate(value: number): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new Value(value);

    if (!value)
      return left(new InvalidArgumentError('Value cannot be zero nor null'));

    if (!thisClassInstance.isValidValue(value))
      return left(new InvalidArgumentError('Value cannot negative number'));

    return right(true);
  }
}
