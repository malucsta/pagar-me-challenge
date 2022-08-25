import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ClientService } from '../../services/client.service';
import { NullArgumentsError } from '../../../shared/errors/controller-error/null-arguments';
import { throwError } from '../../../shared/errors/controller-error/throw-error';
import { isNull } from 'src/psp/shared/helpers/isNull';
import { CreateClientDTO, UpdateClientDTO } from './client.DTO';

@Controller('client')
export class ClientController {
  constructor(private readonly service: ClientService) {}

  @Get(':id')
  async findById(@Res() response, @Param('id') id: string) {
    try {
      const findClientResponse = await this.service.findById(id);

      if (findClientResponse.isLeft())
        throwError(response, findClientResponse.value);

      response.send({ message: {}, data: findClientResponse.value });
    } catch (error) {
      response.status(500).send();
    }
  }

  @Post()
  async create(@Res() response, @Body() client: CreateClientDTO) {
    try {
      if (isNull(client))
        throwError(response, new NullArgumentsError('Empty fields'));

      const createClientResponse = await this.service.create(client);

      if (createClientResponse.isLeft())
        throwError(response, createClientResponse.value);

      return response.send({ message: {}, data: createClientResponse.value });
    } catch (error) {
      return response.status(500).send();
    }
  }

  @Put(':id')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() client: UpdateClientDTO,
  ) {
    try {
      if (isNull(client))
        throwError(response, new NullArgumentsError('Empty fields'));

      const updateClientResponse = await this.service.update(id, client);

      if (updateClientResponse.isLeft())
        throwError(response, updateClientResponse.value);

      return response.send({ message: {}, data: updateClientResponse.value });
    } catch (error) {
      return response.status(500).send();
    }
  }
}
