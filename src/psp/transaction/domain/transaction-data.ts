export interface TransactionDataDTO {
  id?: string;
  description: string;
  paymentMethod: number;
  value: number;
  cardNumber: string;
  cardOwner: string;
  cardExpirationDate: string;
  cardCvv: string;
  client: string;
}

export type CreateTransactionDTO = Omit<TransactionDataDTO, 'id'>;

export interface TransactionData {
  id: string;
  description: string;
  paymentMethod: number;
  value: number;
  cardNumber: string;
  cardOwner: string;
  cardExpirationDate: string;
  cardCvv: string;
  client: string;
}
