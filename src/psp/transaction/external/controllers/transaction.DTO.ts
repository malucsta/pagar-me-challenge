import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { TransactionDataDTO } from '../../domain/transaction-data';
import { PaymentMethodsEnum } from '../../domain/value-objects/payment-method';

export class CreateTransactionDTO implements Omit<TransactionDataDTO, 'id'> {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn(Object.values(PaymentMethodsEnum))
  @IsNotEmpty()
  paymentMethod: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  cardOwner: string;

  @IsString()
  @IsNotEmpty()
  cardExpirationDate: string;

  @IsString()
  @IsNotEmpty()
  cardCvv: string;

  @IsString()
  @IsNotEmpty()
  client: string;
}
