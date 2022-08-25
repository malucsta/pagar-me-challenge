import { PayableData } from '../../domain/payable-data';
import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { PayableStatusEnum } from '../../domain/value-objects/status';

export class CreatePayableDTO
  implements Omit<PayableData, 'id' | 'paymentDate'>
{
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsIn(Object.values(PayableStatusEnum))
  @IsNotEmpty()
  status: number;

  @IsString()
  @IsNotEmpty()
  client: string;

  @IsString()
  @IsNotEmpty()
  transaction: string;
}

export class UpdatePayableDTO
  implements Omit<PayableData, 'id' | 'paymentDate'>
{
  @IsNumber()
  value: number;

  @IsIn(Object.keys(PayableStatusEnum))
  status: number;

  @IsString()
  client: string;

  @IsString()
  transaction: string;
}
