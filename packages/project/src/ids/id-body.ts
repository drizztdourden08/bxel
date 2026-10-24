/* @layer core @kind logic */
import { ID_ALPHABET, ID_BODY_LENGTH } from './id.constants';
import type { ByteProvider } from './id.type';

const idBody = (bytes: ByteProvider): string =>
  Array.from(bytes(ID_BODY_LENGTH), (byte) => ID_ALPHABET.charAt(byte & 31)).join('');

export { idBody };
