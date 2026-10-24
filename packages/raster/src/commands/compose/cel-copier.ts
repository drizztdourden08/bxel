/* @layer core @kind logic */
import type { Cel, CelId, IdSource } from '@bxel/document';
import type { CelCopier } from './compose.type';

const celCopier = (ids: IdSource, cels: Record<CelId, Cel>): CelCopier => {
  const memo = new Map<CelId, CelId>();
  return (celId, pixels) => {
    const known = memo.get(celId);
    if (known !== undefined) return known;
    const id = ids.next('cel') as CelId;
    cels[id] = { id, pixels: pixels() };
    memo.set(celId, id);
    return id;
  };
};

export { celCopier };
