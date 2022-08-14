export interface Client {
  id: string;
  name: string;
  account: string;
  isActive: boolean;
}

export type CreateClientDTO = Omit<Client, 'id' | 'isActive'>;
export type UpdateClientDTO = Omit<Client, 'id' | 'isActive'>;
