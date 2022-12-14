import { Either, left, right } from '../either';
import { generateUUID } from '../helpers/generateUUID';
import { InvalidArgumentError } from '../errors/invalid-argument';

export class Id {
  public readonly id: string;

  private constructor(id?: string) {
    this.id = !id ? generateUUID() : id;
    Object.freeze(this);
  }

  private isValidId(id: string): boolean {
    //for uuid-v4
    return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
      id,
    );
  }

  static create(id?: string): Either<InvalidArgumentError, Id> {
    if (id) {
      const isValidToCreate = Id.validate(id);
      if (isValidToCreate.isLeft()) return left(isValidToCreate.value);

      return right(new Id(id));
    }

    return right(new Id());
  }

  get value() {
    return this.id;
  }

  static validate(id: string): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new Id();

    if (!id) return left(new InvalidArgumentError('Id field cannot be null'));

    if (!thisClassInstance.isValidId(id))
      return left(new InvalidArgumentError('Invalid Id format'));

    return right(true);
  }
}
