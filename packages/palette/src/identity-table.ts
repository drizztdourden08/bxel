/* @layer core @kind logic */
import { REMAP_SIZE } from './remap-size.constants';

const identityTable = (): Uint8Array => Uint8Array.from({ length: REMAP_SIZE }, (_, slot) => slot);

export { identityTable };
