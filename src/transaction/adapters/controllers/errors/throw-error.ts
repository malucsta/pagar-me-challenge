interface TransactionError {
  message: string;
  name: string;
  status: string;
}

export function throwError(response: any, error: TransactionError) {
  return response
    .status(Number(error.status))
    .send({ message: error.message, data: {} });
}
