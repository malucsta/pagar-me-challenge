import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionEntity } from '../../adapters/typeorm/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionService } from '../transaction.service';
import { ClientService } from '../../../client/services/client.service';
import { clientFoundById } from './transaction.mock';

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
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ClientService,
          useValue: {
            findById: jest.fn().mockResolvedValue(clientFoundById),
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
});
