import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ClientDataDTO } from 'src/client/domain/client-data';
import { ClientService } from '../../services/client.service';
import { NullArgumentsError } from './errors/null-argument.error';
import { throwError } from './errors/throw-error';

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
  async create(@Res() response, @Body() client: ClientDataDTO) {
    try {
      const createClientResponse = await this.service.create(client);

      if (createClientResponse.isLeft())
        throwError(response, createClientResponse.value);

      response.send({ message: {}, data: createClientResponse.value });
    } catch (error) {
      response.status(500).send();
    }
  }

  @Put(':id')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() client: ClientDataDTO,
  ) {
    try {
      if (
        [client.account, client.name, client.isActive].every((x) => x === null)
      )
        throwError(response, new NullArgumentsError('Empty fields'));

      const updateClientResponse = await this.service.update(id, client);

      if (updateClientResponse.isLeft())
        throwError(response, updateClientResponse.value);

      response.send({ message: {}, data: updateClientResponse.value });
    } catch (error) {
      response.status(500).send();
    }
  }
}
