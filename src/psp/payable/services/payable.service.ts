import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Either, left, right } from '../../shared/either';
import { InvalidArgumentError } from '../../shared/errors/invalid-argument';
import { Repository } from 'typeorm';
import { PayableEntity } from '../external/typeorm/entities/payable.entity';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found';
import { Payable } from '../domain/payable';
import { PayableData, PayableDataDTO } from '../domain/payable-data';
import { Id } from '../../shared/value-objects/id';
import { PayableStatus } from '../domain/value-objects/status';

@Injectable()
export class PayableService {
  constructor(
    @InjectRepository(PayableEntity)
    private readonly repository: Repository<PayableEntity>,
  ) {}

  async findAll(): Promise<Either<EntityNotFoundError, PayableData[]>> {
    const payables = await this.repository.find();

    if (!payables) return left(new EntityNotFoundError());

    return right(payables);
  }

  async findById(
    id: string,
  ): Promise<Either<EntityNotFoundError | InvalidArgumentError, PayableData>> {
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const payable = await this.repository.findOne({
      where: {
        id: id,
      },
    });

    if (!payable) return left(new EntityNotFoundError(id));

    return right(payable);
  }

  async findByStatus(
    clientId: string,
    status: number,
  ): Promise<
    Either<EntityNotFoundError | InvalidArgumentError, PayableData[]>
  > {
    const isValidStatus = PayableStatus.validate(status);
    if (isValidStatus.isLeft()) return left(isValidStatus.value);

    const payables = await this.repository.find({
      where: {
        client: clientId,
        status: status,
      },
    });

    if (!payables) return left(new EntityNotFoundError());

    return right(payables);
  }

  async retriveBalanceByStatus(
    clientId: string,
    status: number,
  ): Promise<Either<EntityNotFoundError | InvalidArgumentError, number>> {
    const isValidStatus = PayableStatus.validate(status);
    if (isValidStatus.isLeft()) return left(isValidStatus.value);

    const balanceOrError = await this.findByStatus(clientId, status);
    if (balanceOrError.isLeft()) return left(balanceOrError.value);

    let balance = 0;

    balanceOrError.value.forEach((object) => {
      balance += object.value;
    });

    if (!balance) return left(new EntityNotFoundError());

    return right(balance);
  }

  async findByTransaction(
    transactionId: string,
  ): Promise<Either<EntityNotFoundError | InvalidArgumentError, PayableData>> {
    const isValidIdOrError = Id.validate(transactionId);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const payables = await this.repository.find({
      relations: {
        transaction: true,
      },
    });

    const foundPayable = payables
      .map((element) => {
        const id = JSON.parse(JSON.stringify(element.transaction)).id;
        return id === transactionId ? element : null;
      })
      .filter((payable) => payable != null);

    if (!foundPayable) return left(new EntityNotFoundError());

    return right(foundPayable[0]);
  }

  async create(
    payableToCreate: PayableDataDTO,
  ): Promise<Either<InvalidArgumentError, PayableData>> {
    const payableOrError = Payable.create(payableToCreate);
    if (payableOrError.isLeft()) return left(payableOrError.value);

    const payable = Payable.mapObjectToValues(payableOrError.value);
    const createdPayable = await this.repository.save(payable);

    return right(createdPayable);
  }

  async update(
    payableToCreate: PayableDataDTO,
    id: string,
  ): Promise<Either<InvalidArgumentError | EntityNotFoundError, PayableData>> {
    //validates ID
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    //checks if payable exists
    const existingPayableOrError = await this.findById(id);
    if (existingPayableOrError.isLeft())
      return left(existingPayableOrError.value);

    //return payable structure with updated values
    const payableOrError = Payable.constructValidPayable(
      existingPayableOrError.value,
      payableToCreate,
    );
    if (payableOrError.isLeft()) return left(payableOrError.value);

    const payable = Payable.mapObjectToValues(payableOrError.value);
    const updatedPayable = await this.repository.save(payable);

    return right(updatedPayable);
  }

  async delete(
    id: string,
  ): Promise<Either<EntityNotFoundError | InvalidArgumentError, PayableData>> {
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const payableToBeRemoved = await this.findById(id);
    if (payableToBeRemoved.isLeft()) return left(payableToBeRemoved.value);

    const payable = await this.repository.remove(payableToBeRemoved.value);

    return right(payable);
  }
}
