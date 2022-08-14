import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../entities/client.entity';
import { clientMock } from '../mocks/client.mock';
import { ClientService } from './client.service';
import { InvalidIdError } from '../domain/errors/invalid-id';
import { ClientNotFoundError } from '../domain/errors/client-not-found';

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

    it('should return left with InvalidIdError if id is invalid', async () => {
      const clientOrError = await service.findById('123');

      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(InvalidIdError);
    });

    it(`should return left with ClientNotFoundError if client doesn't exist`, async () => {
      jest.spyOn(repository, 'findOne').mockReturnValue(null);

      const clientOrError = await service.findById(mockId);

      expect(clientOrError.isLeft()).toBe(true);
      expect(clientOrError.value).toBeInstanceOf(ClientNotFoundError);
    });
  });
});
