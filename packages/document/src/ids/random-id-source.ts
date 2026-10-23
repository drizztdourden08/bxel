/* @layer core @kind logic */
import { ID_ALPHABET, ID_BODY_LENGTH } from './id-pattern.constants';
import type { ByteProvider, IdSource } from './id-source.type';

const randomIdSource = (bytes: ByteProvider): IdSource => ({
  next: (prefix) => {
    const body = Array.from(bytes(ID_BODY_LENGTH), (byte) => ID_ALPHABET.charAt(byte & 31)).join('');
    return `${prefix}_${body}`;
  },
  fork: () => randomIdSource(bytes),
});

export { randomIdSource };
