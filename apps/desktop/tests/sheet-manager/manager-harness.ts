/* @layer renderer-app @kind test */
import type { SpriteId } from '@bxel/document';
import { NO_FILTER } from '../../src/sheet-manager/manager.constants';
import type { ListQuery } from '../../src/sheet-manager/manager.type';
import { idOf } from '../sheet/sheet-harness';

const idsOf = (...names: string[]): SpriteId[] => names.map(idOf);

const BASE_QUERY: ListQuery = { query: '', filter: NO_FILTER, sortKey: 'manual', sortDown: false };

const PLAIN_ATLAS: { trim: boolean; powerOfTwo: boolean; rotate: boolean; pageSide: number; page: number } = { trim: false, powerOfTwo: false, rotate: false, pageSide: 0, page: 0 };

export { BASE_QUERY, idsOf, PLAIN_ATLAS };
