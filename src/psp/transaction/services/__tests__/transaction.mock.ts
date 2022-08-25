export const singleTransaction = {
  id: 'dd1d7520-03bc-4f9f-85ac-f8bb8e8de18a',
  description: 'Notebook',
  paymentMethod: 1,
  value: 10.99,
  cardNumber: '7890',
  cardOwner: 'Client',
  cardExpirationDate: '01/2023',
  cardCvv: '123',
};

export const TransactionResponse = {
  id: 'dd1d7520-03bc-4f9f-85ac-f8bb8e8de18a',
  description: 'Smartband XYZ 3.0',
  paymentMethod: 1,
  value: 79.99,
  cardNumber: '7890',
  cardOwner: 'Client',
  cardExpirationDate: '01/2023',
  cardCvv: '123',
  client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
};

export const findAllResponse = [
  {
    id: '747a3f7a-33dc-40dd-8970-aecf31c08d0b',
    description: 'Notebook',
    paymentMethod: 1,
    value: 10.99,
    cardNumber: '7890',
    cardOwner: 'Client',
    cardExpirationDate: '01/2023',
    cardCvv: '123',
  },
  {
    id: 'ec37a48e-6194-46cc-8c2c-dadb59b1badc',
    description: 'Necessaire',
    paymentMethod: 1,
    value: 25,
    cardNumber: '7890',
    cardOwner: 'Client Number Two',
    cardExpirationDate: '12/2022',
    cardCvv: '456',
  },
  {
    id: 'dd1d7520-03bc-4f9f-85ac-f8bb8e8de18a',
    description: 'Smartband XYZ 3.0',
    paymentMethod: 1,
    value: 79.99,
    cardNumber: '7890',
    cardOwner: 'Client',
    cardExpirationDate: '01/2023',
    cardCvv: '123',
  },
];

export const FindByClientIdResponse = [
  TransactionResponse,
  TransactionResponse,
];

export const createTransactionDTO = {
  description: 'Smartband XYZ 3.0',
  paymentMethod: 1,
  value: 79.99,
  cardNumber: '1234567890',
  cardOwner: 'Client',
  cardExpirationDate: '01/2023',
  cardCvv: '123',
  client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
};

export const invalidCreateTransactionDTO = {
  description: 'Smartband XYZ 3.0',
  paymentMethod: 1,
  value: 79.99,
  cardNumber: '1234567890',
  cardOwner: 'Client',
  cardExpirationDate: '01/2020',
  cardCvv: '123',
  client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
};

export const clientFoundById = {
  id: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
  name: 'Client',
  account: '123456',
  isActive: true,
};

export const singlePayable = {
  id: 'd6822b62-d8c4-4ea3-926f-1e32e677d92a',
  value: 97,
  paymentDate: '2022-08-22',
  status: 3,
};
