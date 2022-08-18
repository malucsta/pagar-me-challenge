import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientNotFoundError } from '../../client/domain/errors/client-not-found';
import { ClientService } from '../../client/services/client.service';
import { Repository } from 'typeorm';
import { Either, left, right } from '../../shared/either';
import { TransactionEntity } from '../adapters/typeorm/entities/transaction.entity';
import { InvalidArgumentError } from '../domain/errors/invalid-argument';
import { TransactionNotFoundError } from '../domain/errors/not-found';
import { Transaction } from '../domain/transaction';
import {
  TransactionData,
  TransactionDataDTO,
} from '../domain/transaction-data';
import { Id } from '../domain/value objects/transactionId';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
    private readonly clientService: ClientService,
  ) {}

  async findAll(): Promise<Either<InvalidArgumentError, TransactionData[]>> {
    const transactions = await this.repository.find();

    if (!transactions) return left(new TransactionNotFoundError());

    return right(transactions);
  }

  async findById(
    id: string,
  ): Promise<Either<InvalidArgumentError, TransactionData>> {
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const transaction = await this.repository.findOne({
      where: {
        id: id,
      },
    });

    if (!transaction) return left(new TransactionNotFoundError(id));

    return right(transaction);
  }

  async findByClientId(
    id: string,
  ): Promise<Either<InvalidArgumentError, TransactionData[]>> {
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const transaction = await this.repository.find({
      where: {
        client: {
          id: id,
        },
      },
    });

    if (!transaction) return left(new TransactionNotFoundError(id));

    return right(transaction);
  }

  async create(
    transactionToCreate: TransactionDataDTO,
  ): Promise<
    Either<InvalidArgumentError | ClientNotFoundError, TransactionData>
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
      description: transaction.description.description,
      paymentMethod: transaction.paymentMethod.paymentMethod,
      value: transaction.value.value,
      cardNumber: transaction.cardNumber.cardNumber,
      cardOwner: transaction.cardOwner.cardOwner,
      cardExpirationDate: transaction.cardExpirationDate.expirationDate,
      cardCvv: transaction.cardCvv.cardCvv,
      client: client,
    });

    return right(createdTransaction);
  }
}