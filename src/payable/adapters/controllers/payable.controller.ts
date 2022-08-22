import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PayableDataDTO } from 'src/payable/domain/payable-data';
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
