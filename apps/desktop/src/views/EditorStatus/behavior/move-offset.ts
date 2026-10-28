/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { PendingEdit } from '../../../editor/pending/pending.type';

const moveOffset = (pending: PendingEdit | null): Point | null => (pending?.spec.kind === 'move' ? pending.spec.offset : null);

export { moveOffset };
