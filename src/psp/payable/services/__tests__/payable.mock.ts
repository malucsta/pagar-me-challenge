import { PayableEntity } from 'src/psp/payable/adapters/typeorm/entities/payable.entity';
import {
  PayableData,
  PayableDataDTO,
} from 'src/psp/payable/domain/payable-data';

export const payablesList = [
  {
    id: 'd6822b62-d8c4-4ea3-926f-1e32e677d92a',
    value: 97,
    paymentDate: '2022-08-22',
    status: 3,
  },
  {
    id: '4ad55107-0f5e-42bc-b0ba-84ca7173e7dd',
    value: 95,
    paymentDate: '2022-09-22',
    status: 5,
  },
  {
    id: '4ad55107-0f5e-42bc-b0ba-84ca7173e7de',
    value: 190,
    paymentDate: '2022-09-22',
    status: 5,
  },
];

export const payable = {
  id: 'd6822b62-d8c4-4ea3-926f-1e32e677d92a',
  value: 97,
  paymentDate: '2022-08-22',
  status: 3,
};

export const waiting_funds: PayableEntity[] = [
  {
    id: '4ad55107-0f5e-42bc-b0ba-84ca7173e7dd',
    value: 95,
    paymentDate: '2022-09-22',
    status: 5,
    client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
    transaction: '20ef9f08-e5f0-4649-8965-61e0e1dab29f',
  },
  {
    id: '4ad55107-0f5e-42bc-b0ba-84ca7173e7de',
    value: 190,
    paymentDate: '2022-09-22',
    status: 5,
    client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
    transaction: '20ef9f08-e5f0-4649-8965-61e0e1dab29g',
  },
];

export const paid = [
  {
    id: 'd6822b62-d8c4-4ea3-926f-1e32e677d92a',
    value: 97,
    paymentDate: '2022-08-22',
    status: 3,
    client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
    transaction: '20ef9f08-e5f0-4649-8965-61e0e1dab29g',
  },
];

export const payableToCreate: PayableDataDTO = {
  value: 100,
  status: 3,
  client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
  transaction: '8c681c42-cc39-4745-a258-58137f71d491',
};

export const invalidPayableToCreate: PayableDataDTO = {
  value: 100,
  status: 9,
  client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
  transaction: '8c681c42-cc39-4745-a258-58137f71d491',
};

export const createdPayable: PayableData = {
  id: 'd6822b62-d8c4-4ea3-926f-1e32e677d92a',
  value: 97,
  paymentDate: '2022-08-22',
  status: 3,
  client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
  transaction: '8c681c42-cc39-4745-a258-58137f71d491',
};

export const payableToUpdate: PayableDataDTO = {
  value: 200,
  status: 3,
  client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
  transaction: '8c681c42-cc39-4745-a258-58137f71d491',
};

export const updatedPayable: PayableData = {
  id: 'd6822b62-d8c4-4ea3-926f-1e32e677d92a',
  value: 190,
  paymentDate: '2022-08-22',
  status: 3,
  client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
  transaction: '8c681c42-cc39-4745-a258-58137f71d491',
};

export const deletedPayable = {
  id: 'd6822b62-d8c4-4ea3-926f-1e32e677d92a',
  value: 97,
  paymentDate: '2022-08-22',
  status: 3,
  client: '20ef9f08-e5f0-4649-8965-61e0e1dab29e',
  transaction: '20ef9f08-e5f0-4649-8965-61e0e1dab29g',
};
