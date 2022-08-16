import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../errors/invalid-argument';

export class Account {
  public readonly account: string;

  private constructor(name: string) {
    this.account = name;
    Object.freeze(this);
  }

  get value() {
    return this.account;
  }

  private isValidLength(account: string): boolean {
    return account.length < 255;
  }

  static create(account: string): Either<InvalidArgumentError, Account> {
    const isValidOrError = Account.validate(account);

    if (isValidOrError.isLeft()) return left(isValidOrError.value);

    return right(new Account(account));
  }

  static validate(account: string): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new Account(account);

    if (!account)
      return left(new InvalidArgumentError('Account cannot be null'));

    if (account.trim() === '')
      return left(new InvalidArgumentError('Account cannot be empty string'));

    if (!thisClassInstance.isValidLength(account))
      return left(
        new InvalidArgumentError('Account is too long. Max length: 255'),
      );

    return right(true);
  }
}
