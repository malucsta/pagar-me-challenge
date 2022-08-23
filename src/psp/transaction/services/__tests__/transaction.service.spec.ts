import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionEntity } from '../../external/typeorm/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionService } from '../transaction.service';
import { ClientService } from '../../../client/services/client.service';
import { EntityNotFoundError } from '../../../shared/errors/entity-not-found';
import {
  clientFoundById,
  createTransactionDTO,
  TransactionResponse,
  findAllResponse,
  FindByClientIdResponse,
  findByIdResponse,
  invalidCreateTransactionDTO,
} from './transaction.mock';
import { InvalidArgumentError } from '../../../shared/errors/invalid-argument';
import { right, left } from '../../../shared/either';

describe('Transaction Service', () => {
  let transactionService: TransactionService;
  let clientService: ClientService;
  let repository: Repository<TransactionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(findAllResponse),
            findOne: jest.fn().mockResolvedValue(findByIdResponse),
            save: jest.fn().mockResolvedValue(TransactionResponse),
          },
        },
        {
          provide: ClientService,
          useValue: {
            findById: jest.fn().mockResolvedValue(right(clientFoundById)),
          },
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    clientService = module.get<ClientService>(ClientService);
    repository = module.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
  });

  it('client service should be defined', () => {
    expect(clientService).toBeDefined();
  });

  it('transaction service should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  it('transaction repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('FindAll', () => {
    it('should return right with all transactions', async () => {
      const transactions = await transactionService.findAll();

      expect(repository.find).toBeCalledTimes(1);
      expect(transactions.isRight()).toBe(true);
      expect(transactions.value).toBe(findAllResponse);
    });

    it('should return left with TransactionNotFoundError if no transaction was found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(null);
      const transactions = await transactionService.findAll();

      expect(repository.find).toBeCalledTimes(1);
      expect(transactions.isLeft()).toBe(true);
      expect(transactions.value).toBeInstanceOf(EntityNotFoundError);
    });
  });

  describe('FindById', () => {
    const mockId = findByIdResponse.id;
    it('should return right with transaction', async () => {
      const transaction = await transactionService.findById(mockId);

      expect(repository.findOne).toBeCalledTimes(1);
      expect(transaction.isRight()).toBe(true);
      expect(transaction.value).toBe(findByIdResponse);
    });

    it('should return left InvalidArgumentError if id is invalid', async () => {
      const transaction = await transactionService.findById('123');

      expect(repository.findOne).toBeCalledTimes(0);
      expect(transaction.isLeft()).toBe(true);
      expect(transaction.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left TransactionNotFoundError if transaction does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const transaction = await transactionService.findById(mockId);

      expect(transaction.isLeft()).toBe(true);
      expect(transaction.value).toBeInstanceOf(EntityNotFoundError);
    });
  });

  describe('FindByClientId', () => {
    const clientId = createTransactionDTO.client;
    it('should return right with list of transactions', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([TransactionResponse, TransactionResponse]);
      const transactions = await transactionService.findByClientId(clientId);

      expect(repository.find).toBeCalledTimes(1);
      expect(transactions.isRight()).toBe(true);
      expect(transactions.value).toEqual(FindByClientIdResponse);
    });

    it('should return left with InvalidArgumentError if id is invalid', async () => {
      const transactions = await transactionService.findByClientId('123');

      expect(repository.find).toBeCalledTimes(0);
      expect(transactions.isLeft()).toBe(true);
      expect(transactions.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with TransactionNotFoundError if there are no transactions for the client', async () => {
      jest.spyOn(repository, 'find').mockReturnValue(null);
      const transactions = await transactionService.findByClientId(clientId);

      expect(repository.find).toBeCalledTimes(1);
      expect(transactions.isLeft()).toBe(true);
      expect(transactions.value).toBeInstanceOf(EntityNotFoundError);
    });
  });

  describe('Create', () => {
    it('should return right with created transaction', async () => {
      const createdTransaction = await transactionService.create(
        createTransactionDTO,
      );

      expect(repository.save).toBeCalledTimes(1);
      expect(createdTransaction.isRight()).toBe(true);
      expect(createdTransaction.value).toBe(TransactionResponse);
    });

    it('should return left with InvalidArgumentError if one of the fields is invalid', async () => {
      const createdTransaction = await transactionService.create(
        invalidCreateTransactionDTO,
      );

      expect(repository.save).toBeCalledTimes(0);
      expect(createdTransaction.isLeft()).toBe(true);
      expect(createdTransaction.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with ClientNotFoundError if client does not exist', async () => {
      jest
        .spyOn(clientService, 'findById')
        .mockResolvedValue(
          left(new EntityNotFoundError(createTransactionDTO.client)),
        );
      const createdTransaction = await transactionService.create(
        createTransactionDTO,
      );

      expect(repository.save).toBeCalledTimes(0);
      expect(createdTransaction.isLeft()).toBe(true);
      expect(createdTransaction.value).toBeInstanceOf(EntityNotFoundError);
    });
  });
});
