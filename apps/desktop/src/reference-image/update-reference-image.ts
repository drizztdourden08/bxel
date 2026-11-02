/* @layer renderer-app @kind logic */
import type { ReferenceChange } from '../asset-view/reference-image.type';
import { useAssetViewStore } from '../stores/useAssetViewStore';
import { currentReferences } from './current-references';
import { currentViewKey } from './current-view-key';
import { REFERENCE_LIMITS } from './reference-image.constants';

const within = (value: number, range: { min: number; max: number }): number => Math.min(range.max, Math.max(range.min, Math.round(value)));

const clean = (change: ReferenceChange): ReferenceChange => ({
  ...change,
  ...(change.x === undefined ? {} : { x: within(change.x, REFERENCE_LIMITS.offset) }),
  ...(change.y === undefined ? {} : { y: within(change.y, REFERENCE_LIMITS.offset) }),
  ...(change.scale === undefined ? {} : { scale: within(change.scale, REFERENCE_LIMITS.scale) }),
  ...(change.opacity === undefined ? {} : { opacity: within(change.opacity, REFERENCE_LIMITS.opacity) }),
});

const updateReferenceImage = (id: string, change: ReferenceChange): boolean => {
  const key = currentViewKey();
  const list = currentReferences();
  if (key === null || !list.some((each) => each.id === id)) return false;
  const fields = clean(change);
  useAssetViewStore.getState().patch(key, { references: list.map((each) => (each.id === id ? { ...each, ...fields } : each)) });
  return true;
};

export { updateReferenceImage };
