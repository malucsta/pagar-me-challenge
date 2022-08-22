import { InvalidArgumentError } from './errors/invalid-argument';
import { Payable } from './payable';
import { Id } from './value-objects/id';
import { PaymentDate } from './value-objects/payment-date';
import { PayableStatus, PayableStatusEnum } from './value-objects/status';
import { Value } from './value-objects/value';

describe('Payable Domain Entity', () => {
  describe('Payable Id', () => {
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

  describe('Payable value', () => {
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

  describe('Payable payment date', () => {
    it('should return right with valid payment date', () => {
      const date = new Date('2022-08-20');
      const paymentDateOrError = PaymentDate.create('2022-08-20');

      const paymentDate = paymentDateOrError.isRight()
        ? paymentDateOrError.value.value
        : null;

      expect(paymentDateOrError.isRight()).toBe(true);
      expect(paymentDateOrError.value).toBeInstanceOf(PaymentDate);
      expect(paymentDate).toBe(date.toUTCString());
    });

    it('should return left with InvalidArgumentError if payment date is null', () => {
      const paymentDateOrError = PaymentDate.create(null);

      expect(paymentDateOrError.isLeft()).toBe(true);
      expect(paymentDateOrError.value).toBeInstanceOf(InvalidArgumentError);
      expect(paymentDateOrError.value).toEqual(
        new InvalidArgumentError('Payment date cannot be null'),
      );
    });

    it('should return left with InvalidArgumentError if payment date year is < actual year', () => {
      const paymentDateOrError = PaymentDate.create('2021-08-20');

      expect(paymentDateOrError.isLeft()).toBe(true);
      expect(paymentDateOrError.value).toBeInstanceOf(InvalidArgumentError);
      expect(paymentDateOrError.value).toEqual(
        new InvalidArgumentError('Invalid year'),
      );
    });

    it('should return left with InvalidArgumentError if payment date month is past', () => {
      const paymentDateOrError = PaymentDate.create('2022-01-20');

      expect(paymentDateOrError.isLeft()).toBe(true);
      expect(paymentDateOrError.value).toBeInstanceOf(InvalidArgumentError);
      expect(paymentDateOrError.value).toEqual(
        new InvalidArgumentError('Invalid month'),
      );
    });

    it('should return left with InvalidArgumentError if payment date month is invalid', () => {
      const paymentDateOrError = PaymentDate.create('2022-13-20');

      expect(paymentDateOrError.isLeft()).toBe(true);
      expect(paymentDateOrError.value).toBeInstanceOf(InvalidArgumentError);
      expect(paymentDateOrError.value).toEqual(
        new InvalidArgumentError('Payment date is invalid'),
      );
    });
    it('should return left with InvalidArgumentError if payment date day is invalid', () => {
      const paymentDateOrError = PaymentDate.create('2022-12-35');

      expect(paymentDateOrError.isLeft()).toBe(true);
      expect(paymentDateOrError.value).toBeInstanceOf(InvalidArgumentError);
      expect(paymentDateOrError.value).toEqual(
        new InvalidArgumentError('Payment date is invalid'),
      );
    });
  });

  describe('Payable status', () => {
    it('should return right with valid payable status', () => {
      const statusOrError = PayableStatus.create(5);

      const status = statusOrError.isRight() ? statusOrError.value.value : null;

      expect(statusOrError.isRight()).toBe(true);
      expect(statusOrError.value).toBeInstanceOf(PayableStatus);
      expect(status).toEqual(PayableStatusEnum.waiting_funds);
    });

    it('should return left with InvalidArgumentError if status is null', () => {
      const statusOrError = PayableStatus.create(null);

      expect(statusOrError.isLeft()).toBe(true);
      expect(statusOrError.value).toBeInstanceOf(InvalidArgumentError);
      expect(statusOrError.value).toEqual(
        new InvalidArgumentError('Payable status cannot be null'),
      );
    });

    it('should return left with InvalidArgumentError if status is invalid', () => {
      const statusOrError = PayableStatus.create(9);

      expect(statusOrError.isLeft()).toBe(true);
      expect(statusOrError.value).toBeInstanceOf(InvalidArgumentError);
      expect(statusOrError.value).toEqual(
        new InvalidArgumentError('Invalid payable status'),
      );
    });
  });

  describe('Payable creation', () => {
    it('should return right with created payable if no id is provided', () => {
      const date = new Date();
      const expectedDate = new Date(
        date.setMonth(date.getMonth() + 1),
      ).toUTCString();

      const payableOrError = Payable.create({
        value: 100,
        status: 5,
        client: '913c5e59-53aa-47d7-8753-66aa49584e89',
        transaction: '913c5e59-53aa-47d7-8753-66aa49584e80',
      });

      const payable = payableOrError.isRight() ? payableOrError.value : null;

      expect(payableOrError.isRight()).toBe(true);
      expect(payableOrError.value).toBeInstanceOf(Payable);
      expect(payable.id).toBeInstanceOf(Id);
      expect(payable.paymentDate.value).toEqual(expectedDate);
      expect(payable.value.getValue).toBe(95);
      expect(payable.clientId.value).toBe(
        '913c5e59-53aa-47d7-8753-66aa49584e89',
      );
      expect(payable.transactionId.value).toBe(
        '913c5e59-53aa-47d7-8753-66aa49584e80',
      );
    });

    it('should return right with created payable if id is provided', () => {
      const date = new Date();
      const expectedDate = new Date(
        date.setMonth(date.getMonth() + 1),
      ).toUTCString();

      const payableOrError = Payable.create(
        {
          value: 100,
          status: 5,
          client: '913c5e59-53aa-47d7-8753-66aa49584e89',
          transaction: '913c5e59-53aa-47d7-8753-66aa49584e80',
        },
        '913c5e59-53aa-47d7-8753-66aa49584e81',
      );

      const payable = payableOrError.isRight() ? payableOrError.value : null;

      expect(payableOrError.isRight()).toBe(true);
      expect(payableOrError.value).toBeInstanceOf(Payable);
      expect(payable.id.value).toBe('913c5e59-53aa-47d7-8753-66aa49584e81');
      expect(payable.paymentDate.value).toEqual(expectedDate);
      expect(payable.value.getValue).toBe(95);
      expect(payable.clientId.value).toBe(
        '913c5e59-53aa-47d7-8753-66aa49584e89',
      );
      expect(payable.transactionId.value).toBe(
        '913c5e59-53aa-47d7-8753-66aa49584e80',
      );
    });

    it('payment date should be same day if status is 3', () => {
      const date = new Date().toUTCString();

      const payableOrError = Payable.create({
        value: 100,
        status: 3,
        client: '913c5e59-53aa-47d7-8753-66aa49584e89',
        transaction: '913c5e59-53aa-47d7-8753-66aa49584e80',
      });

      const payable = payableOrError.isRight() ? payableOrError.value : null;

      expect(payableOrError.isRight()).toBe(true);
      expect(payableOrError.value).toBeInstanceOf(Payable);
      expect(payable.paymentDate.value).toEqual(date);
    });

    it('payment date should be actual date + 30 days if status is 5', () => {
      const date = new Date();
      const expectedDate = new Date(
        date.setMonth(date.getMonth() + 1),
      ).toUTCString();

      const payableOrError = Payable.create({
        value: 100,
        status: 5,
        client: '913c5e59-53aa-47d7-8753-66aa49584e89',
        transaction: '913c5e59-53aa-47d7-8753-66aa49584e80',
      });

      const payable = payableOrError.isRight() ? payableOrError.value : null;

      expect(payableOrError.isRight()).toBe(true);
      expect(payableOrError.value).toBeInstanceOf(Payable);
      expect(payable.paymentDate.value).toEqual(expectedDate);
    });
  });
});
