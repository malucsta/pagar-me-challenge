import { Either, left, right } from '../../shared/either';
import { generateUUID } from '../../shared/helpers/generateUUID';
import { InvalidIdError } from './errors/invalid-id';

export class Id {
  private readonly id: string;

  private constructor() {
    this.id = generateUUID();
    Object.freeze(this);
  }

  private isValidId(id: string): boolean {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
      id,
    );
  }

  static create(): Id {
    return new Id();
  }

  static validate(id: string): Either<InvalidIdError, boolean> {
    const thisClassInstance = new Id();

    if (!id) return left(new InvalidIdError());

    if (!thisClassInstance.isValidId(id)) return left(new InvalidIdError());

    return right(true);
  }
}
