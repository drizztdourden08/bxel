/* @layer core @kind logic */
import { nameKey } from '../../validate/name-key';
import { LAYER_NAME_PREFIX } from './layer.constants';

const nextLayerName = (taken: readonly string[]): string => {
  const keys = new Set(taken.map(nameKey));
  const start = taken.length + 1;
  const candidates = Array.from({ length: taken.length + 1 }, (_, offset) => `${LAYER_NAME_PREFIX} ${start + offset}`);
  return candidates.find((candidate) => !keys.has(nameKey(candidate))) ?? `${LAYER_NAME_PREFIX} ${start}`;
};

export { nextLayerName };
