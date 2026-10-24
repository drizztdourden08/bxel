/* @layer core @kind constants */
const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_PADDING = '=';
const BASE64_SEXTET_MASK = 63;
const BASE64_SHAPE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const BASE64_LOOKUP: ReadonlyMap<string, number> = new Map(
  [...BASE64_ALPHABET].map((character, index): [string, number] => [character, index]),
);

export { BASE64_ALPHABET, BASE64_LOOKUP, BASE64_PADDING, BASE64_SEXTET_MASK, BASE64_SHAPE };
