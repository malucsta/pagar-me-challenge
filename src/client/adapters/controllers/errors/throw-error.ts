interface ClientError {
  message: string;
  name: string;
  status: string;
}

export function throwError(response: any, error: ClientError) {
  return response
    .status(Number(error.status))
    .send({ message: error.message, data: {} });
}
