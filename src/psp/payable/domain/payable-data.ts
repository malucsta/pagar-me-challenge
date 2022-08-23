export interface PayableData {
  id: string;
  value: number;
  paymentDate: string;
  status: number;
  client: string;
  transaction: string;
}

export type PayableDataDTO = Omit<PayableData, 'id' | 'paymentDate'>;
