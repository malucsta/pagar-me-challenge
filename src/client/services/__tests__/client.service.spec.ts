import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../../adapters/typeorm/entities/client.entity';
import {
  clientMock,
  createClientDTOMock,
  deactivatedClientMock,
  updateClientAccountDTOMock,
  updateClientDTOMock,
  updateClientNameDTOMock,
  updateClientStatusDTOMock,
  updatedClientAccountMock,
  updatedClientMock,
  updatedClientNameMock,
} from './client.mock';
import { ClientService } from '../client.service';
import { InvalidArgumentError } from '../../domain/errors/invalid-argument';
import { ClientNotFoundError } from '../../domain/errors/client-not-found';

describe('ClientService', () => {
  let service: ClientService;
  let repository: Repository<ClientEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(ClientEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(clientMock),
            save: jest.fn().mockResolvedValue(clientMock),
          },
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    repository = module.get<Repository<ClientEntity>>(
      getRepositoryToken(ClientEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('FindById', () => {
    const mockId = clientMock.id;

    it('should return right with found user', async () => {
      const clientOrError = await service.findById(mockId);

      expect(repository.findOne).toBeCalledTimes(1);
      expect(clientOrError.isRight()).toBe(true);
      expect(clientOrError.value).toBe(clientMock);
    });

    it('should return left with InvalidArgumentError if id is invalid', async () => {
      const clientOrError = await service.findById('123');

      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it(`should return left with ClientNotFoundError if client doesn't exist`, async () => {
      jest.spyOn(repository, 'findOne').mockReturnValue(null);

      const clientOrError = await service.findById(mockId);

      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(ClientNotFoundError);
    });
  });

  describe('Create', () => {
    it('should return right with created client', async () => {
      const clientOrError = await service.create(createClientDTOMock);

      expect(repository.save).toBeCalledTimes(1);
      expect(clientOrError.isRight()).toBe(true);
      expect(clientOrError.value).toBe(clientMock);
    });

    it('should return left with InvalidArgumentError if name.length > 255', async () => {
      const longName = 'abc'.repeat(256);

      const clientOrError = await service.create({
        name: longName,
        account: createClientDTOMock.account,
        isActive: true,
      });

      expect(repository.save).toBeCalledTimes(0);
      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if name has numbers or special characters/punctuation', async () => {
      let clientOrError = await service.create({
        name: 'client.',
        account: createClientDTOMock.account,
        isActive: true,
      });

      expect(repository.save).toBeCalledTimes(0);
      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);

      clientOrError = await service.create({
        name: 'client2',
        account: createClientDTOMock.account,
        isActive: true,
      });

      expect(repository.save).toBeCalledTimes(0);
      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if name is empty string', async () => {
      const clientOrError = await service.create({
        name: '',
        account: createClientDTOMock.account,
        isActive: true,
      });

      expect(repository.save).toBeCalledTimes(0);
      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if account.length > 255', async () => {
      const longAccount = 'abc'.repeat(256);

      const clientOrError = await service.create({
        name: createClientDTOMock.name,
        account: longAccount,
        isActive: true,
      });

      expect(repository.save).toBeCalledTimes(0);
      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with InvalidArgumentError if account is empty string', async () => {
      const clientOrError = await service.create({
        name: createClientDTOMock.name,
        account: '           ',
        isActive: true,
      });

      expect(repository.save).toBeCalledTimes(0);
      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('update', () => {
    const mockId = clientMock.id;
    it('should return right with updated client when updating all fields', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(updatedClientMock);
      const clientOrError = await service.update(mockId, updateClientDTOMock);

      expect(repository.save).toBeCalledTimes(1);
      expect(clientOrError.isRight()).toBe(true);
      expect(clientOrError.value).toBe(updatedClientMock);
    });

    it('should return right with updated client when updating name field', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(updatedClientNameMock);
      const clientOrError = await service.update(
        mockId,
        updateClientNameDTOMock,
      );

      expect(repository.save).toBeCalledTimes(1);
      expect(clientOrError.isRight()).toBe(true);
      expect(clientOrError.value).toBe(updatedClientNameMock);
    });

    it('should return right with updated client when updating account field', async () => {
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(updatedClientAccountMock);

      const clientOrError = await service.update(
        mockId,
        updateClientAccountDTOMock,
      );

      expect(repository.save).toBeCalledTimes(1);
      expect(clientOrError.isRight()).toBe(true);
      expect(clientOrError.value).toBe(updatedClientAccountMock);
    });

    it('should return right with updated client when updating isActive field', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(deactivatedClientMock);

      const clientOrError = await service.update(
        mockId,
        updateClientStatusDTOMock,
      );

      expect(repository.save).toBeCalledTimes(1);
      expect(clientOrError.isRight()).toBe(true);
      expect(clientOrError.value).toBe(deactivatedClientMock);
    });

    it('should return left with InvalidArgumentError if id is not provided', async () => {
      const clientOrError = await service.update(null, updatedClientMock);

      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with ClientNotFoundError if client does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const clientOrError = await service.update(
        '913c5e59-53aa-47d7-8753-66aa49584e89',
        updatedClientMock,
      );

      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(ClientNotFoundError);
    });
  });
});
