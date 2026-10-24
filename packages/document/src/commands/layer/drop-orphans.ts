/* @layer core @kind logic */
import type { CelId } from '../../model/ids.type';
import type { Cel, Layer } from '../../model/sprite.type';

const dropOrphans = (
  cels: Readonly<Record<CelId, Cel>>,
  removed: Layer,
  remaining: readonly Layer[],
): Readonly<Record<CelId, Cel>> => {
  const used = new Set<string>(remaining.flatMap((layer) => Object.values(layer.cels)));
  const gone = new Set<string>(Object.values(removed.cels).filter((celId) => !used.has(celId)));
  if (gone.size === 0) return cels;
  return Object.fromEntries(Object.entries(cels).filter(([celId]) => !gone.has(celId)));
};

export { dropOrphans };
