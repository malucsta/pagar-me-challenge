import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PayableEntity } from '../../adapters/typeorm/entities/payable.entity';
import { Repository } from 'typeorm';
import { PayableService } from '../payable.service';
import {
  createdPayable,
  deletedPayable,
  invalidPayableToCreate,
  payable,
  payablesList,
  payableToCreate,
  payableToUpdate,
  updatedPayable,
  waiting_funds,
} from './payable.mock';
import { EntityNotFoundError } from '../../../shared/errors/entity-not-found';
import { PayableStatusEnum } from '../../domain/value-objects/status';
import { InvalidArgumentError } from '../../../shared/errors/invalid-argument';

const mockId = 'd6822b62-d8c4-4ea3-926f-1e32e677d92a';
const clientId = '20ef9f08-e5f0-4649-8965-61e0e1dab29e';

describe('PayableService', () => {
  let service: PayableService;
  let repository: Repository<PayableEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayableService,
        {
          provide: getRepositoryToken(PayableEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(payablesList),
            findOne: jest.fn().mockResolvedValue(payable),
            save: jest.fn().mockResolvedValue(createdPayable),
            remove: jest.fn().mockResolvedValue(deletedPayable),
          },
        },
      ],
    }).compile();

    service = module.get<PayableService>(PayableService);
    repository = module.get<Repository<PayableEntity>>(
      getRepositoryToken(PayableEntity),
    );
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('FindAll', () => {
    it('should return right with list of payables', async () => {
      const payablesOrError = await service.findAll();

      expect(payablesOrError.isRight()).toBe(true);
      expect(payablesOrError.value).toBe(payablesList);
    });

    it('should return left with PayableNotFoundError with no payables were found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(null);
      const payablesOrError = await service.findAll();

      expect(payablesOrError.isLeft()).toBe(true);
      expect(payablesOrError.value).toBeInstanceOf(EntityNotFoundError);
    });
  });

  describe('Find By Id', () => {
    it('should return right with payable', async () => {
      const payableOrError = await service.findById(mockId);

      expect(payableOrError.isRight()).toBe(true);
      expect(payableOrError.value).toBe(payable);
    });

    it('should return left with PayableNotFoundError with no payable were found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const payableOrError = await service.findById(mockId);

      expect(payableOrError.isLeft()).toBe(true);
      expect(payableOrError.value).toBeInstanceOf(EntityNotFoundError);
    });
  });

  describe('Find By Status', () => {
    it('should return right with payables which status is waiting_funds', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(waiting_funds);
      const payableOrError = await service.findByStatus(
        clientId,
        PayableStatusEnum.paid,
      );

      expect(payableOrError.isRight()).toBe(true);
      expect(payableOrError.value).toBe(waiting_funds);
    });

    it('should return left with PayableNotFoundError with no payable were found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(null);
      const payableOrError = await service.findByStatus(
        clientId,
        PayableStatusEnum.paid,
      );

      expect(payableOrError.isLeft()).toBe(true);
      expect(payableOrError.value).toBeInstanceOf(EntityNotFoundError);
    });

    it('should return left with InvalidArgumentError if status is invalid', async () => {
      const payableOrError = await service.findByStatus(clientId, 200);

      expect(payableOrError.isLeft()).toBe(true);
      expect(payableOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Create', () => {
    it('should return right with a valid created payable', async () => {
      const createdPayableOrError = await service.create(payableToCreate);

      expect(createdPayableOrError.isRight()).toBe(true);
      expect(createdPayableOrError.value).toBe(createdPayable);
    });

    it('should return left with InvalidArgumentError if an argument is invalid', async () => {
      const createdPayableOrError = await service.create(
        invalidPayableToCreate,
      );

      expect(createdPayableOrError.isLeft()).toBe(true);
      expect(createdPayableOrError.value).toBeInstanceOf(InvalidArgumentError);
    });
  });

  describe('Update', () => {
    it('should return right with updated payable', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(updatedPayable);

      const updatedPayableOrError = await service.update(
        payableToUpdate,
        mockId,
      );

      expect(updatedPayableOrError.isRight()).toBe(true);
      expect(updatedPayableOrError.value).toBe(updatedPayable);
    });

    it('should return left with InvalidArgumentError if id is invalid', async () => {
      const updatedPayableOrError = await service.update(
        payableToUpdate,
        '123',
      );

      expect(updatedPayableOrError.isLeft()).toBe(true);
      expect(updatedPayableOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with PayableNotFoundError if payable to update does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const updatedPayableOrError = await service.update(
        payableToUpdate,
        mockId,
      );

      expect(updatedPayableOrError.isLeft()).toBe(true);
      expect(updatedPayableOrError.value).toBeInstanceOf(EntityNotFoundError);
    });
  });

  describe('Delete', () => {
    it('should return right with deleted payable', async () => {
      const updatedPayableOrError = await service.delete(mockId);

      expect(updatedPayableOrError.isRight()).toBe(true);
      expect(updatedPayableOrError.value).toBe(deletedPayable);
    });

    it('should return left with InvalidArgumentError if id is invalid', async () => {
      const updatedPayableOrError = await service.delete('123');

      expect(updatedPayableOrError.isLeft()).toBe(true);
      expect(updatedPayableOrError.value).toBeInstanceOf(InvalidArgumentError);
    });

    it('should return left with PayableNotFoundError if payable to delete does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const updatedPayableOrError = await service.delete(mockId);

      expect(updatedPayableOrError.isLeft()).toBe(true);
      expect(updatedPayableOrError.value).toBeInstanceOf(EntityNotFoundError);
    });
  });
});
