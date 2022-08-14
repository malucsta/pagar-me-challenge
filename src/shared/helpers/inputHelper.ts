export class InputHelper {
  static isValidAccount(account: string): boolean {
    //tests if it only has numbers
    return /^\d+$/.test(account);
  }

  static isValidName(name: string) {
    return name
      .split(' ')
      .map((string) => {
        return /^[a-zA-Z']+$/.test(string);
      })
      .every((x) => x === true);
  }

  static isValidId(id: string): boolean {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
      id,
    );
  }
}
