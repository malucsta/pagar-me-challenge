export function validateAccount(account: string) {
  //tests if it only has numbers
  return /^\d+$/.test(account);
}
