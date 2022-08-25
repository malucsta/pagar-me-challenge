import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CreateTransactionDTO } from '../../domain/transaction-data';
import { TransactionService } from '../../services/transaction.service';
import { throwError } from '../../../shared/errors/controller-error/throw-error';
import { NullArgumentsError } from 'src/psp/shared/errors/controller-error/null-arguments';
import { isNull } from 'src/psp/shared/helpers/isNull';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  async findAll(@Res() response) {
    try {
      const findTransactionResponse = await this.service.findAll();

      if (findTransactionResponse.isLeft())
        throwError(response, findTransactionResponse.value);

      response.send({ message: {}, data: findTransactionResponse.value });
    } catch (error) {
      response.status(500).send({ message: 'internal server error', data: {} });
    }
  }

  @Get(':id')
  async findById(@Res() response, @Param('id') id: string) {
    try {
      const findTransactionResponse = await this.service.findById(id);

      if (findTransactionResponse.isLeft())
        throwError(response, findTransactionResponse.value);

      response.send({ message: {}, data: findTransactionResponse.value });
    } catch (error) {
      response.status(500).send({ message: 'internal server error', data: {} });
    }
  }

  @Post()
  async create(@Res() response, @Body() transaction: CreateTransactionDTO) {
    try {
      if (isNull(transaction))
        return throwError(response, new NullArgumentsError('Empty fields'));

      const createTransactionResponse = await this.service.create(transaction);

      if (createTransactionResponse.isLeft())
        return throwError(response, createTransactionResponse.value);

      return response.send({
        message: {},
        data: createTransactionResponse.value,
      });
    } catch (error) {
      response.status(500).send({ message: 'internal server error', data: {} });
    }
  }

  @Delete(':id')
  async delete(@Res() response, @Param('id') id: string) {
    try {
      const deleteTransactionResponse = await this.service.delete(id);

      if (deleteTransactionResponse.isLeft())
        return throwError(response, deleteTransactionResponse.value);

      return response.send({
        message: {},
        data: deleteTransactionResponse.value,
      });
    } catch (error) {
      response.status(500).send({ message: 'internal server error', data: {} });
    }
  }
}
