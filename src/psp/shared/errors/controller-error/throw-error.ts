interface PspError {
  message: string;
  name: string;
  status: string;
}

export function throwError(response: any, error: PspError) {
  return response
    .status(Number(error.status))
    .send({ message: error.message, data: {} });
}
