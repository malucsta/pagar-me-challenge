// eslint-disable-next-line @typescript-eslint/ban-types
export function isNull(object: Object): boolean {
  return Object.values(object).every((x) => x === null) || object === null;
}
