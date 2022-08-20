import { InvalidArgumentError } from './errors/invalid-argument';
import { CardCvv } from './value objects/transactionCardCvv';
import { CardExpirationDate } from './value objects/transactionCardExpirationDate';
import { CardNumber } from './value objects/transactionCardNumber';
import { CardOwner } from './value objects/transactionCardOwner';
import { Description } from './value objects/transactionDescription';
import { Id } from './value objects/transactionId';
import {
  PaymentMethod,
  PaymentMethodsEnum,
} from './value objects/transactionMethod';
import { Value } from './value objects/transactionValue';

describe('Transaction domain entity', () => {
  describe('Transaction Id', () => {
    it('should create a valid uuid Id if no id is provided', () => {
      const idOrError = Id.create();

      expect(idOrError.isRight()).toBe(true);
      expect(idOrError.value).toBeInstanceOf(Id);
    });

    it('should return a valid uuid Id if id is provided', () => {
      const idOrError = Id.create('913c5e59-53aa-47d7-8753-66aa49584e89');

      expect(idOrError.isRight()).toBe(true);
      expect(idOrError.value).toBeInstanceOf(Id);
    });

    it('should return left with InvalidArgumentError if id format is invalid', () => {
      const idOrError = Id.create('123');

      expect(idOrError.isLeft()).toBe(true);
      expect(idOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Transaction Description', () => {
    it('should return a valid description', () => {
      const descriptionOrError = Description.create('Smartband XYZ 3.0');

      const value = descriptionOrError.isRight()
        ? descriptionOrError.value.value
        : null;

      expect(descriptionOrError.isRight()).toBe(true);
      expect(descriptionOrError.value).toBeInstanceOf(Description);
      expect(value).toBe('Smartband XYZ 3.0');
    });

    it('should return left with InvalidArgumentError if description.length > 512', () => {
      const descriptionOrError = Description.create(
        'Smartband XYZ 3.0'.repeat(513),
      );

      expect(descriptionOrError.isLeft()).toBe(true);
      expect(descriptionOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if description is null', () => {
      const descriptionOrError = Description.create(null);

      expect(descriptionOrError.isLeft()).toBe(true);
      expect(descriptionOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if description is empty string', () => {
      const descriptionOrError = Description.create('           ');

      expect(descriptionOrError.isLeft()).toBe(true);
      expect(descriptionOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Transaction Payment Method', () => {
    it('should return a valid payment method', () => {
      const methodOrError = PaymentMethod.create(PaymentMethodsEnum.creditCard);

      const value = methodOrError.isRight() ? methodOrError.value.value : null;

      expect(methodOrError.isRight()).toBe(true);
      expect(methodOrError.value).toBeInstanceOf(PaymentMethod);
      expect(value).toBe(PaymentMethodsEnum.creditCard);
    });

    it('should return left with InvalidArgumentError if payment method is null', () => {
      const methodOrError = PaymentMethod.create(null);

      expect(methodOrError.isLeft()).toBe(true);
      expect(methodOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if provided payment method does not exist', () => {
      const methodOrError = PaymentMethod.create(9);

      expect(methodOrError.isLeft()).toBe(true);
      expect(methodOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Transaction Value', () => {
    it('should return a valid value', () => {
      const valueOrError = Value.create(99.99);

      const value = valueOrError.isRight() ? valueOrError.value.getValue : null;

      expect(valueOrError.isRight()).toBe(true);
      expect(valueOrError.value).toBeInstanceOf(Value);
      expect(value).toBe(99.99);
    });

    it('should return left with InvalidArgumentError if value is null', () => {
      const valueOrError = Value.create(null);

      expect(valueOrError.isLeft()).toBe(true);
      expect(valueOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if value is negative', () => {
      const valueOrError = Value.create(-10);

      expect(valueOrError.isLeft()).toBe(true);
      expect(valueOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if value is zero', () => {
      const valueOrError = Value.create(0);

      expect(valueOrError.isLeft()).toBe(true);
      expect(valueOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Transaction card number', () => {
    it('should return last four digits of a valid card number', () => {
      const cardNumberOrError = CardNumber.create('1234567890');

      const value = cardNumberOrError.isRight()
        ? cardNumberOrError.value.value
        : null;

      expect(cardNumberOrError.isRight()).toBe(true);
      expect(cardNumberOrError.value).toBeInstanceOf(CardNumber);
      expect(value).toBe('7890');
    });

    it('should return left with InvalidArgumentError if card number is empty string', () => {
      const cardNumberOrError = CardNumber.create('        ');

      expect(cardNumberOrError.isLeft()).toBe(true);
      expect(cardNumberOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if card number is null', () => {
      const cardNumberOrError = CardNumber.create(null);

      expect(cardNumberOrError.isLeft()).toBe(true);
      expect(cardNumberOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if card number length =< 4', () => {
      const cardNumberOrError = CardNumber.create('1234');

      expect(cardNumberOrError.isLeft()).toBe(true);
      expect(cardNumberOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if card number has letters', () => {
      const cardNumberOrError = CardNumber.create('abcdefgh');

      expect(cardNumberOrError.isLeft()).toBe(true);
      expect(cardNumberOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Transaction card owner', () => {
    it('should return a valid card owner name', () => {
      const cardOwnerOrError = CardOwner.create('Card Owner');

      const value = cardOwnerOrError.isRight()
        ? cardOwnerOrError.value.value
        : null;

      expect(cardOwnerOrError.isRight()).toBe(true);
      expect(cardOwnerOrError.value).toBeInstanceOf(CardOwner);
      expect(value).toBe('Card Owner');
    });

    it('should return left with InvalidArgumentError if card owner name is null', () => {
      const cardOwnerOrError = CardOwner.create(null);

      expect(cardOwnerOrError.isLeft()).toBe(true);
      expect(cardOwnerOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if card owner name is empty string', () => {
      const cardOwnerOrError = CardOwner.create('         ');

      expect(cardOwnerOrError.isLeft()).toBe(true);
      expect(cardOwnerOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if card owner name length > 255', () => {
      const cardOwnerOrError = CardOwner.create('abc'.repeat(256));

      expect(cardOwnerOrError.isLeft()).toBe(true);
      expect(cardOwnerOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Transaction card expiration date', () => {
    it('should return a valid card expiration date', () => {
      const expirationDateOrError = CardExpirationDate.create('11/2022');

      const value = expirationDateOrError.isRight()
        ? expirationDateOrError.value.value
        : null;

      expect(expirationDateOrError.isRight()).toBe(true);
      expect(expirationDateOrError.value).toBeInstanceOf(CardExpirationDate);
      expect(value).toBe('11/2022');
    });

    it('should return left with InvalidArgumentError if expiration year < actual year', () => {
      const expirationDateOrError = CardExpirationDate.create('11/2021');

      expect(expirationDateOrError.isLeft()).toBe(true);
      expect(expirationDateOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if expiration date < actual date', () => {
      const expirationDateOrError = CardExpirationDate.create('01/2022');

      expect(expirationDateOrError.isLeft()).toBe(true);
      expect(expirationDateOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if invalid date is provided', () => {
      const expirationDateOrError = CardExpirationDate.create('13/2022');

      expect(expirationDateOrError.isLeft()).toBe(true);
      expect(expirationDateOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if date != 7 characters', () => {
      const expirationDateOrError = CardExpirationDate.create('01/01/2022');

      expect(expirationDateOrError.isLeft()).toBe(true);
      expect(expirationDateOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if date has letters', () => {
      const expirationDateOrError = CardExpirationDate.create('12/202a');

      expect(expirationDateOrError.isLeft()).toBe(true);
      expect(expirationDateOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if date is null', () => {
      const expirationDateOrError = CardExpirationDate.create(null);

      expect(expirationDateOrError.isLeft()).toBe(true);
      expect(expirationDateOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Transaction card cvv', () => {
    it('should return valid cvv', () => {
      const cvvOrError = CardCvv.create('123');

      const value = cvvOrError.isRight() ? cvvOrError.value.value : null;

      expect(cvvOrError.isRight()).toBe(true);
      expect(cvvOrError.value).toBeInstanceOf(CardCvv);
      expect(value).toBe('123');
    });

    it('should return left with InvalidArgumentError if cvv.length != 3', () => {
      const cvvOrError = CardCvv.create('1234');

      expect(cvvOrError.isLeft()).toBe(true);
      expect(cvvOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if cvv has letters', () => {
      const cvvOrError = CardCvv.create('a23');

      expect(cvvOrError.isLeft()).toBe(true);
      expect(cvvOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if cvv is null', () => {
      const cvvOrError = CardCvv.create(null);

      expect(cvvOrError.isLeft()).toBe(true);
      expect(cvvOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });
});
