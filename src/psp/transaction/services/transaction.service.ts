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
import { PayableService } from '../../payable/services/payable.service';
import { PayableStatusEnum } from '../../payable/domain/value-objects/status';

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
    //validates data
    const transactionOrError = Transaction.create(transactionToCreate);
    if (transactionOrError.isLeft()) return left(transactionOrError.value);

    //checks if client exists
    const clientOrError = await this.clientService.findById(
      transactionToCreate.client,
    );
    if (clientOrError.isLeft()) return left(clientOrError.value);

    //extract values
    const transaction = Transaction.mapObjectToValues(transactionOrError.value);
    const client = clientOrError.value;

    //saves transaction
    const createdTransaction = await this.repository.save(transaction);

    //creates payable
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

  async delete(
    id: string,
  ): Promise<
    Either<InvalidArgumentError | EntityNotFoundError, TransactionData>
  > {
    //validates id
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    //checks if transaction exists and returns it
    const transactionToBeRemoved = await this.findById(id);
    if (transactionToBeRemoved.isLeft())
      return left(transactionToBeRemoved.value);

    //find corresponding payable and deletes it
    const payableToRemove = await this.payableService.findByTransaction(
      transactionToBeRemoved.value.id,
    );
    if (payableToRemove.isLeft()) return left(payableToRemove.value);
    const deletedPayableOrError = await this.payableService.delete(
      payableToRemove.value.id,
    );
    if (deletedPayableOrError.isLeft())
      return left(deletedPayableOrError.value);

    //deletes transaction
    const transaction = await this.repository.remove(
      transactionToBeRemoved.value,
    );

    return right(transaction);
  }
}
