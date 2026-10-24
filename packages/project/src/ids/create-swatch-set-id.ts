/* @layer core @kind logic */
import { idBody } from './id-body';
import { ID_PREFIX } from './id.constants';
import type { ByteProvider, SwatchSetId } from './id.type';

const createSwatchSetId = (bytes: ByteProvider): SwatchSetId => `${ID_PREFIX.swatchSet}_${idBody(bytes)}`;

export { createSwatchSetId };
