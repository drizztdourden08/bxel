/* @layer renderer-app @kind test */
import type { SpriteId } from '@bxel/document';
import { idOf } from '../sheet/sheet-harness';

const idsOf = (...names: string[]): SpriteId[] => names.map(idOf);

const PLAIN_ATLAS: { trim: boolean; powerOfTwo: boolean; rotate: boolean; pageSide: number; page: number } = { trim: false, powerOfTwo: false, rotate: false, pageSide: 0, page: 0 };

export { idsOf, PLAIN_ATLAS };
