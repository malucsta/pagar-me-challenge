import { Client, CreateClientDTO, UpdateClientDTO } from '../client';

export const clientMock: Client = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'FirstClient',
  account: '123456789',
  isActive: true,
};

export const createClientDTOMock: CreateClientDTO = {
  name: 'FirstClient',
  account: '123456789',
};

export const updateClientDTOMock: UpdateClientDTO = {
  name: 'ClientNumberOne',
  account: '123',
};

export const updateClientAccountDTOMock: UpdateClientDTO = {
  name: null,
  account: '123',
};

export const updateClientNameDTOMock: UpdateClientDTO = {
  name: 'ClientNumberOne',
  account: null,
};

export const updatedClientMock: Client = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'ClientNumberOne',
  account: '123',
  isActive: true,
};

export const updatedClientAccountMock: Client = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'FirstClient',
  account: '123',
  isActive: true,
};

export const updatedClientNameMock: Client = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'ClientNumberOne',
  account: '123456789',
  isActive: true,
};

export const deactivatedClientMock: Client = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'FirstClient',
  account: '123456789',
  isActive: false,
};

// export const clientListMock: Client[] = [
//   {
//     id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
//     name: 'Client1',
//     account: '123456789',
//     isActive: true,
//   },
//   {
//     id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
//     name: 'Client2',
//     account: '987654321',
//     isActive: true,
//   },
//   {
//     id: 'ce341c71-307f-4379-bb86-bf56a662e33a',
//     name: 'Client3',
//     account: '1234',
//     isActive: true,
//   },
// ];
