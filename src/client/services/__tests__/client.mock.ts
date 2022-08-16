import { ClientData } from 'src/client/domain/client-data';

export const clientMock = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'FirstClient',
  account: '123456789',
  isActive: true,
};

export const createClientDTOMock: ClientData = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'FirstClient',
  account: '123456789',
  isActive: true,
};

export const updateClientDTOMock: ClientData = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'ClientNumberOne',
  account: '123',
  isActive: false,
};

export const updateClientAccountDTOMock: ClientData = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: null,
  account: '123',
  isActive: true,
};

export const updateClientNameDTOMock: ClientData = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'ClientNumberOne',
  account: null,
  isActive: null,
};

export const updateClientStatusDTOMock: ClientData = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: null,
  account: null,
  isActive: false,
};

export const updatedClientMock = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'ClientNumberOne',
  account: '123',
  isActive: true,
};

export const updatedClientAccountMock = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'FirstClient',
  account: '123',
  isActive: true,
};

export const updatedClientNameMock = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'ClientNumberOne',
  account: '123456789',
  isActive: true,
};

export const deactivatedClientMock = {
  id: 'bf6d809d-de1a-4166-8a52-5e85c992d051',
  name: 'FirstClient',
  account: '123456789',
  isActive: false,
};
