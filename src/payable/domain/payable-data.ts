export interface PayableData {
  id: string;
  value: number;
  paymentDate: string;
  status: number;
  clientId: string;
  transactionId: string;
}

export type PayableDataDTO = Omit<PayableData, 'id' | 'paymentDate'>;
