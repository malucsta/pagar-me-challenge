import { generateUUID } from 'src/shared/helpers/generateUUID';
import { Client } from './client';
import { InvalidArgumentError } from './errors/invalid-argument';
import { Account } from './value objects/clientAccount';
import { Id } from './value objects/clientId';
import { Name } from './value objects/clientName';

describe('Client Domain Entity', () => {
  describe('Name', () => {
    it('should create a valid name', () => {
      const nameOrError = Name.create('Client To Be Created');
      expect(nameOrError.isRight()).toBe(true);
      expect(nameOrError.value).toBeInstanceOf(Name);
    });

    it('should return left with InvalidArgumentError if name is null', () => {
      const nameOrError = Name.create(null);

      expect(nameOrError.isLeft()).toBe(true);
      expect(nameOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if name has special characters', () => {
      const nameOrError = Name.create('Client--');

      expect(nameOrError.isLeft()).toBe(true);
      expect(nameOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if name is empty string', () => {
      const nameOrError = Name.create('        ');

      expect(nameOrError.isLeft()).toBe(true);
      expect(nameOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if name.length > 255', () => {
      const nameOrError = Name.create('abc'.repeat(256));

      expect(nameOrError.isLeft()).toBe(true);
      expect(nameOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Account', () => {
    it('should create a valid account', () => {
      const accountOrError = Account.create('123456789-e');

      expect(accountOrError.isRight()).toBe(true);
      expect(accountOrError.value).toBeInstanceOf(Account);
    });

    it('should return left with InvalidArgumentError if account is empty string', () => {
      const accountOrError = Account.create('     ');

      expect(accountOrError.isLeft()).toBe(true);
      expect(accountOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if account.length > 255', () => {
      const accountOrError = Account.create('123abc'.repeat(256));

      expect(accountOrError.isLeft()).toBe(true);
      expect(accountOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Id', () => {
    it('should return a valid Id if no uuid is provided', () => {
      //when creating a new client
      const idOrError = Id.create();

      expect(idOrError.isRight()).toBe(true);
      expect(idOrError.value).toBeInstanceOf(Id);
    });

    it('should return left if an invalid uuid is provided to create Id', () => {
      //when updating existing client
      const idOrError = Id.create('123456789');

      expect(idOrError.isLeft()).toBe(true);
      expect(idOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('create', () => {
    it('should return a valid Client if no id is provided', () => {
      //when creating Client
      const clientOrError = Client.create({
        name: 'Client',
        account: '123456789',
        isActive: true,
      });

      let clientAccount, clientName, clientIsActive;

      if (clientOrError.isRight()) {
        clientAccount = clientOrError.value.account.value;
        clientName = clientOrError.value.name.value;
        clientIsActive = clientOrError.value.isActive;
      }

      expect(clientOrError.isRight()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(Client);
      expect(clientName).toBe('Client');
      expect(clientAccount).toBe('123456789');
      expect(clientIsActive).toBe(true);
    });

    it('should return a valid Client if id is provided', () => {
      //when creating Client
      const clientOrError = Client.create(
        {
          name: 'Client',
          account: '123456789',
          isActive: true,
        },
        '913c5e59-53aa-47d7-8753-66aa49584e89',
      );

      let clientId, clientAccount, clientName, clientIsActive;

      if (clientOrError.isRight()) {
        clientId = clientOrError.value.id.value;
        clientAccount = clientOrError.value.account.value;
        clientName = clientOrError.value.name.value;
        clientIsActive = clientOrError.value.isActive;
      }

      expect(clientOrError.isRight()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(Client);
      expect(clientId).toBe('913c5e59-53aa-47d7-8753-66aa49584e89');
      expect(clientName).toBe('Client');
      expect(clientAccount).toBe('123456789');
      expect(clientIsActive).toBe(true);
    });

    it('should return left with InvalidArgumentError if status is not provided', () => {
      const clientOrError = Client.create({
        name: 'Client',
        account: '123456789',
        isActive: null,
      });

      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if account is invalid', () => {
      const clientOrError = Client.create({
        name: 'Client',
        account: '',
        isActive: true,
      });

      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if name is invalid', () => {
      const clientOrError = Client.create({
        name: 'Client--',
        account: '123456789',
        isActive: true,
      });

      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });
});
