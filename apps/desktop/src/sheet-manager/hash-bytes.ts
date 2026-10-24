/* @layer renderer-app @kind logic */
import { HASH_PRIME, HASH_START } from './identical.constants';

const hashBytes = (bytes: Uint8Array): number => {
  let hash = HASH_START;
  for (const value of bytes) hash = Math.imul(hash ^ value, HASH_PRIME) >>> 0;
  return hash;
};

export { hashBytes };
