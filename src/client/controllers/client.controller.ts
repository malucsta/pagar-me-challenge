import { Controller, Get, Param, Res } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { throwClientError } from './errors/throw.client-error';

@Controller('client')
export class ClientController {
  constructor(private readonly service: ClientService) {}

  @Get(':id')
  async findById(@Res() response, @Param('id') id: string) {
    try {
      const findClientResponse = await this.service.findById(id);

      if (findClientResponse.isLeft())
        throwClientError(response, findClientResponse.value);

      response.send({ message: {}, data: findClientResponse.value });
    } catch (error) {
      response.status(500).send();
    }
  }
}
