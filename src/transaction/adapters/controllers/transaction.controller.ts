import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { TransactionDataDTO } from '../../domain/transaction-data';
import { TransactionService } from '../../services/transaction.service';
import { throwError } from './errors/throw-error';

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

  @Get('client/:id')
  async findByClientId(@Res() response, @Param('id') id: string) {
    try {
      const findTransactionResponse = await this.service.findByClientId(id);

      if (findTransactionResponse.isLeft())
        throwError(response, findTransactionResponse.value);

      response.send({ message: {}, data: findTransactionResponse.value });
    } catch (error) {
      response.status(500).send({ message: 'internal server error', data: {} });
    }
  }

  @Post()
  async create(@Res() response, @Body() transaction: TransactionDataDTO) {
    try {
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
}
