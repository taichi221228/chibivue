export const hasOwn = (
  val: object,
  key: string | symbol,
): key is keyof typeof val => Object.prototype.hasOwnProperty.call(val, key);

const camelizeRE = /-(\w)/g;

export const camelize = (str: string): string =>
  str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));
