import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Res,
} from '@nestjs/common';
import { throwError } from '../shared/errors/controller-error/throw-error';
import { PayableService } from '../payable/services/payable.service';
import { PayableStatusEnum } from '../payable/domain/value-objects/status';

@Controller()
export class PSPController {
  constructor(private readonly payableService: PayableService) {}

  @Get('client/:id/available')
  async getAvailableBalance(@Res() response, @Param('id') clientId: string) {
    try {
      const balanceOrError = await this.payableService.retriveBalanceByStatus(
        clientId,
        PayableStatusEnum.paid,
      );

      if (balanceOrError.isLeft()) throwError(response, balanceOrError.value);

      return response.send({ message: {}, data: balanceOrError.value });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get('client/:id/waiting-funds')
  async getPendingBalance(@Res() response, @Param('id') clientId: string) {
    try {
      const balanceOrError = await this.payableService.retriveBalanceByStatus(
        clientId,
        PayableStatusEnum.waiting_funds,
      );

      if (balanceOrError.isLeft()) throwError(response, balanceOrError.value);

      return response.send({ message: {}, data: balanceOrError.value });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
