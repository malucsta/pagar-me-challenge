import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Either, left, right } from 'src/shared/either';
import { InvalidArgumentError } from 'src/transaction/domain/errors/invalid-argument';
import { Repository } from 'typeorm';
import { PayableEntity } from '../adapters/typeorm/entities/payable.entity';
import { PayableNotFoundError } from '../domain/errors/not-found';
import { Payable } from '../domain/payable';
import { CreatePayableDataDTO, PayableData } from '../domain/payable-data';
import { Id } from '../domain/value-objects/id';

@Injectable()
export class PayableService {
  constructor(
    @InjectRepository(PayableEntity)
    private readonly repository: Repository<PayableEntity>,
  ) {}

  async findAll(): Promise<Either<PayableNotFoundError, PayableData[]>> {
    const payables = await this.repository.find();

    if (!payables) return left(new PayableNotFoundError());

    return right(payables);
  }

  async findById(
    id: string,
  ): Promise<Either<PayableNotFoundError | InvalidArgumentError, PayableData>> {
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const payable = await this.repository.findOne({
      where: {
        id: id,
      },
    });

    if (!payable) return left(new PayableNotFoundError(id));

    return right(payable);
  }

  async create(
    payableToCreate: CreatePayableDataDTO,
  ): Promise<Either<InvalidArgumentError, PayableData>> {
    const payableOrError = Payable.create(payableToCreate);

    if (payableOrError.isLeft()) return left(payableOrError.value);

    const payable = payableOrError.value;

    const createdPayable = await this.repository.save({
      id: payable.id.value,
      value: payable.value.getValue,
      paymentDate: payable.paymentDate.value,
      status: payable.status.value,
      client: payable.clientId.value,
      transaction: payable.transactionId.value,
    });

    return right(createdPayable);
  }

  async delete(
    id: string,
  ): Promise<Either<PayableNotFoundError | InvalidArgumentError, PayableData>> {
    const isValidIdOrError = Id.validate(id);
    if (isValidIdOrError.isLeft()) return left(isValidIdOrError.value);

    const payableToBeRemoved = await this.findById(id);
    if (payableToBeRemoved.isLeft()) return left(payableToBeRemoved.value);

    const payable = await this.repository.remove(payableToBeRemoved.value);

    return right(payable);
  }
}
