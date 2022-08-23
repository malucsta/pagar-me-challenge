import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found';
import { ClientService } from '../../client/services/client.service';
import { Repository } from 'typeorm';
import { Either, left, right } from '../../shared/either';
import { TransactionEntity } from '../external/typeorm/entities/transaction.entity';
import { InvalidArgumentError } from '../../shared/errors/invalid-argument';
import { Transaction } from '../domain/transaction';
import {
  TransactionData,
  TransactionDataDTO,
} from '../domain/transaction-data';
import { Id } from '../domain/value-objects/id';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
    private readonly clientService: ClientService,
  ) {}

  async findAll(): Promise<Either<EntityNotFoundError, TransactionData[]>> {
    const transactions = await this.repository.find();

    if (!transactions) return left(new EntityNotFoundError());

    return right(transactions);
  }

  async findById(
    id: string,
  ): Promise<
    Either<InvalidArgumentError | EntityNotFoundError, TransactionData>
  > {
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const transaction = await this.repository.findOne({
      where: {
        id: id,
      },
    });

    if (!transaction) return left(new EntityNotFoundError(id));

    return right(transaction);
  }

  async findByClientId(
    id: string,
  ): Promise<
    Either<InvalidArgumentError | EntityNotFoundError, TransactionData[]>
  > {
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const transaction = await this.repository.find({
      where: {
        client: {
          id: id,
        },
      },
    });

    if (!transaction || transaction === [])
      return left(new EntityNotFoundError(id));

    return right(transaction);
  }

  async create(
    transactionToCreate: TransactionDataDTO,
  ): Promise<
    Either<InvalidArgumentError | EntityNotFoundError, TransactionData>
  > {
    const transactionOrError = Transaction.create(transactionToCreate);
    const clientOrError = await this.clientService.findById(
      transactionToCreate.client,
    );

    if (clientOrError.isLeft()) return left(clientOrError.value);
    if (transactionOrError.isLeft()) return left(transactionOrError.value);

    const transaction = transactionOrError.value;
    const client = clientOrError.value;

    const createdTransaction = await this.repository.save({
      id: transaction.id.value,
      description: transaction.description.value,
      paymentMethod: transaction.paymentMethod.value,
      value: transaction.value.getValue,
      cardNumber: transaction.cardNumber.value,
      cardOwner: transaction.cardOwner.value,
      cardExpirationDate: transaction.cardExpirationDate.value,
      cardCvv: transaction.cardCvv.value,
      client: client,
    });

    return right(createdTransaction);
  }
}
