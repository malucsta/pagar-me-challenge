export interface PayableDataDTO {
  id: string;
  value: number;
  paymentDate: string;
  status: number;
  client: string;
  transaction: string;
}

export type CreatePayableDataDTO = Omit<PayableDataDTO, 'id' | 'paymentDate'>;

export interface PayableData {
  id: string;
  value: number;
  paymentDate: string;
  status: number;
  client: string;
  transaction: string;
}
