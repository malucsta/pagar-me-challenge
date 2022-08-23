import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { PayableDataDTO } from 'src/payable/domain/payable-data';
import { PayableStatusEnum } from 'src/payable/domain/value-objects/status';
import { PayableService } from 'src/payable/services/payable.service';
import { NullArgumentsError } from './errors/null-argument.error';
import { throwError } from './errors/throw-error';

@Controller('payable')
export class PayableController {
  constructor(private readonly service: PayableService) {}

  @Get()
  async findAll(@Res() response) {
    try {
      const findPayableResponse = await this.service.findAll();

      if (findPayableResponse.isLeft())
        return throwError(response, findPayableResponse.value);

      return response.send({
        message: {},
        data: findPayableResponse.value,
      });
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'internal server error', data: {} });
    }
  }

  @Get(':id')
  async findById(@Res() response, @Param('id') id: string) {
    try {
      const findPayableResponse = await this.service.findById(id);

      if (findPayableResponse.isLeft())
        return throwError(response, findPayableResponse.value);

      return response.send({
        message: {},
        data: findPayableResponse.value,
      });
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'internal server error', data: {} });
    }
  }

  @Get(':id/available')
  async findPaid(@Res() response, @Param('clientId') clientId: string) {
    try {
      const findPayableResponse = await this.service.findByStatus(
        clientId,
        PayableStatusEnum.paid,
      );

      if (findPayableResponse.isLeft())
        return throwError(response, findPayableResponse.value);

      return response.send({
        message: {},
        data: findPayableResponse.value,
      });
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'internal server error', data: {} });
    }
  }

  @Get(':id/waiting_funds')
  async findWaitingFunds(@Res() response, @Param('clientId') clientId: string) {
    try {
      const findPayableResponse = await this.service.findByStatus(
        clientId,
        PayableStatusEnum.waiting_funds,
      );

      if (findPayableResponse.isLeft())
        return throwError(response, findPayableResponse.value);

      return response.send({
        message: {},
        data: findPayableResponse.value,
      });
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'internal server error', data: {} });
    }
  }

  @Post()
  async create(@Res() response, @Body() payable: PayableDataDTO) {
    try {
      if (
        [
          payable.value,
          payable.client,
          payable.transaction,
          payable.status,
        ].every((x) => x === null)
      )
        return throwError(response, new NullArgumentsError('Empty fields'));

      const createPayableResponse = await this.service.create(payable);

      if (createPayableResponse.isLeft())
        return throwError(response, createPayableResponse.value);

      return response.send({
        message: {},
        data: createPayableResponse.value,
      });
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'internal server error', data: {} });
    }
  }

  @Put(':id')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() payable: PayableDataDTO,
  ) {
    try {
      if (
        [
          payable.value,
          payable.client,
          payable.transaction,
          payable.status,
        ].every((x) => x === null)
      )
        return throwError(response, new NullArgumentsError('Empty fields'));

      const updatePayableResponse = await this.service.update(payable, id);

      if (updatePayableResponse.isLeft())
        return throwError(response, updatePayableResponse.value);

      return response.send({
        message: {},
        data: updatePayableResponse.value,
      });
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'internal server error', data: {} });
    }
  }

  @Delete(':id')
  async delete(@Res() response, @Param('id') id: string) {
    try {
      const deletePayableResponse = await this.service.delete(id);

      if (deletePayableResponse.isLeft())
        return throwError(response, deletePayableResponse.value);

      return response.send({
        message: {},
        data: deletePayableResponse.value,
      });
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'internal server error', data: {} });
    }
  }
}
