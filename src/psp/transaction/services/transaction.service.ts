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
import { Id } from '../../shared/value-objects/id';
import { PayableService } from 'src/psp/payable/services/payable.service';
import { PayableStatusEnum } from 'src/psp/payable/domain/value-objects/status';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
    private readonly clientService: ClientService,
    private readonly payableService: PayableService,
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

  async create(
    transactionToCreate: TransactionDataDTO,
  ): Promise<
    Either<InvalidArgumentError | EntityNotFoundError, TransactionData>
  > {
    const transactionOrError = Transaction.create(transactionToCreate);
    if (transactionOrError.isLeft()) return left(transactionOrError.value);

    const clientOrError = await this.clientService.findById(
      transactionToCreate.client,
    );
    if (clientOrError.isLeft()) return left(clientOrError.value);

    const transaction = Transaction.mapObjectToValues(transactionOrError.value);
    const client = clientOrError.value;

    const createdTransaction = await this.repository.save(transaction);

    const createdPayableOrError = await this.payableService.create({
      value: transaction.value,
      status:
        transaction.paymentMethod === 1
          ? PayableStatusEnum.waiting_funds
          : PayableStatusEnum.paid,
      client: client.id,
      transaction: transaction.id,
    });

    if (createdPayableOrError.isLeft())
      return left(createdPayableOrError.value);

    return right(createdTransaction);
  }
}
