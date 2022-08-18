import { Either, left, right } from '../../../shared/either';
import { InvalidArgumentError } from '../errors/invalid-argument';

export class CardExpirationDate {
  public readonly expirationDate: string;

  private constructor(expirationDate: string) {
    this.expirationDate = expirationDate;
    Object.freeze(this);
  }

  private isValidYear(year: number): boolean {
    return year >= new Date().getFullYear();
  }

  private isValidMonth(month: number): boolean {
    return month <= 12;
  }

  private isValidYet(month: number, year: number): boolean {
    return year > new Date().getFullYear()
      ? true
      : Number(month) >= new Date().getMonth();
  }

  private isValidFormat(string: string): boolean {
    return /^\d+$/.test(string);
  }

  static create(
    expirationDate: string,
  ): Either<InvalidArgumentError, CardExpirationDate> {
    const isValidDateOrError = CardExpirationDate.validate(expirationDate);

    if (isValidDateOrError.isLeft()) return left(isValidDateOrError.value);

    return right(new CardExpirationDate(expirationDate));
  }

  static validate(
    expirationDate: string,
  ): Either<InvalidArgumentError, boolean> {
    const thisClassInstance = new CardExpirationDate(expirationDate);

    if (!expirationDate)
      return left(new InvalidArgumentError('Expiration date cannot be null'));

    if (expirationDate.length != 7)
      return left(
        new InvalidArgumentError(
          'Please provide a valid expiration date. Format: mm/YYYY',
        ),
      );

    const year = expirationDate.substring(
      expirationDate.length - 4,
      expirationDate.length,
    );

    const month = expirationDate.substring(0, 2);

    if (
      !thisClassInstance.isValidFormat(month) ||
      !thisClassInstance.isValidFormat(year)
    )
      return left(
        new InvalidArgumentError(
          'Month and year should only have numeric symbols',
        ),
      );

    if (!thisClassInstance.isValidYear(Number(year)))
      return left(
        new InvalidArgumentError('Invalid year. Card already expired'),
      );

    if (!thisClassInstance.isValidMonth(Number(month)))
      return left(new InvalidArgumentError('Invalid month'));

    if (!thisClassInstance.isValidYet(Number(month), Number(year)))
      return left(new InvalidArgumentError('Card already expired'));

    return right(true);
  }
}
