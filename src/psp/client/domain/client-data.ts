export interface ClientData {
  id: string;
  name: string;
  account: string;
  isActive: boolean;
}

export type ClientDataDTO = Omit<ClientData, 'id'>;
