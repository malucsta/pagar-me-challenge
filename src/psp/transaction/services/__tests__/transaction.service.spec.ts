import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionEntity } from '../../external/typeorm/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionService } from '../transaction.service';
import { ClientService } from '../../../client/services/client.service';
import { EntityNotFoundError } from '../../../shared/errors/entity-not-found';
import {
  createTransactionDTO,
  TransactionResponse,
  findAllResponse,
  singleTransaction,
  invalidCreateTransactionDTO,
  clientFoundById,
  singlePayable,
} from './transaction.mock';
import { InvalidArgumentError } from '../../../shared/errors/invalid-argument';
import { right, left } from '../../../shared/either';
import { PayableService } from '../../../payable/services/payable.service';

describe('Transaction Service', () => {
  let transactionService: TransactionService;
  let clientService: ClientService;
  let payableService: PayableService;
  let repository: Repository<TransactionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(findAllResponse),
            findOne: jest.fn().mockResolvedValue(singleTransaction),
            save: jest.fn().mockResolvedValue(TransactionResponse),
            remove: jest.fn().mockResolvedValue(singleTransaction),
          },
        },
        {
          provide: ClientService,
          useValue: {
            findById: jest.fn().mockResolvedValue(right(clientFoundById)),
          },
        },
        {
          provide: PayableService,
          useValue: {
            create: jest.fn().mockResolvedValue(right(singlePayable)),
            findByTransaction: jest
              .fn()
              .mockResolvedValue(right(singlePayable)),
            delete: jest.fn().mockResolvedValue(right(singlePayable)),
          },
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    clientService = module.get<ClientService>(ClientService);
    payableService = module.get<PayableService>(PayableService);
    repository = module.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
  });

  it('transaction service should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  it('client service should be defined', () => {
    expect(clientService).toBeDefined();
  });

  it('payable service should be defined', () => {
    expect(payableService).toBeDefined();
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

    it('should return left with EntityNotFoundError if no transaction was found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(null);
      const transactions = await transactionService.findAll();

      expect(repository.find).toBeCalledTimes(1);
      expect(transactions.isLeft()).toBe(true);
      expect(transactions.value).toBeInstanceOf(EntityNotFoundError);
    });
  });

  describe('FindById', () => {
    const mockId = singleTransaction.id;
    it('should return right with transaction', async () => {
      const transaction = await transactionService.findById(mockId);

      expect(repository.findOne).toBeCalledTimes(1);
      expect(transaction.isRight()).toBe(true);
      expect(transaction.value).toBe(singleTransaction);
    });

    it('should return left InvalidArgumentError if id is invalid', async () => {
      const transaction = await transactionService.findById('123');

      expect(repository.findOne).toBeCalledTimes(0);
      expect(transaction.isLeft()).toBe(true);
      expect(transaction.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left EntityNotFoundError if transaction does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const transaction = await transactionService.findById(mockId);

      expect(transaction.isLeft()).toBe(true);
      expect(transaction.value).toBeInstanceOf(EntityNotFoundError);
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

    it('should return left with EntityNotFoundError if client does not exist', async () => {
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

    it('should return left with InvalidArgumentError if payable data is invalid', async () => {
      jest
        .spyOn(payableService, 'create')
        .mockResolvedValue(
          left(new InvalidArgumentError('Value cannot be zero nor null')),
        );
      const createdTransaction = await transactionService.create(
        createTransactionDTO,
      );

      expect(repository.save).toBeCalledTimes(1);
      expect(createdTransaction.isLeft()).toBe(true);
      expect(createdTransaction.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Delete', () => {
    const mockId = singleTransaction.id;

    it('should return right with deleted transaction', async () => {
      const transactionOrError = await transactionService.delete(mockId);

      expect(repository.remove).toBeCalledTimes(1);
      expect(transactionOrError.isRight()).toBe(true);
      expect(transactionOrError.value).toBe(singleTransaction);
    });

    it('should return left with InvalidArgumentError if id is invalid', async () => {
      const transactionOrError = await transactionService.delete('123');

      expect(repository.remove).toBeCalledTimes(0);
      expect(transactionOrError.isLeft()).toBe(true);
      expect(transactionOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with EntityNotFoundError if transaction does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const transactionOrError = await transactionService.delete(mockId);

      expect(repository.remove).toBeCalledTimes(0);
      expect(transactionOrError.isLeft()).toBe(true);
      expect(transactionOrError.value).toBeInstanceOf(EntityNotFoundError);
    });

    it('should return left with EntityNotFoundError if corresponding payable does not exist', async () => {
      jest
        .spyOn(payableService, 'findByTransaction')
        .mockResolvedValue(left(new EntityNotFoundError()));
      const transactionOrError = await transactionService.delete(mockId);

      expect(repository.remove).toBeCalledTimes(0);
      expect(transactionOrError.isLeft()).toBe(true);
      expect(transactionOrError.value).toBeInstanceOf(EntityNotFoundError);
    });
  });
});
