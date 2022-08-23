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

  async create(
    payableToCreate: PayableDataDTO,
  ): Promise<Either<InvalidArgumentError, PayableData>> {
    const payableOrError = Payable.create(payableToCreate);

    if (payableOrError.isLeft()) return left(payableOrError.value);

    const payable = payableOrError.value;

    const createdPayable = await this.repository.save({
      id: payable.id.value,
      value: payable.value.getValue,
      paymentDate: payable.paymentDate.value,
      status: payable.status.value,
      client: payable.client.value,
      transaction: payable.transaction.value,
    });

    return right(createdPayable);
  }

  async update(
    payableToCreate: PayableDataDTO,
    id: string,
  ): Promise<Either<InvalidArgumentError | EntityNotFoundError, PayableData>> {
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const existingPayableOrError = await this.findById(id);
    if (existingPayableOrError.isLeft())
      return left(existingPayableOrError.value);

    const payableOrError = Payable.constructValidPayable(
      existingPayableOrError.value,
      payableToCreate,
    );

    if (payableOrError.isLeft()) return left(payableOrError.value);

    const payable = payableOrError.value;

    const updatedPayable = await this.repository.save({
      id: payable.id.value,
      value: payable.value.getValue,
      paymentDate: payable.paymentDate.value,
      status: payable.status.value,
      client: payable.client.value,
      transaction: payable.transaction.value,
    });

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
