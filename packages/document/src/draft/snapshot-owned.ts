/* @layer core @kind logic */
import type { Draft } from './draft.type';

const snapshotOwned = (draft: Draft): void => {
  for (const [celId, pixels] of draft.owned) draft.baselines.set(celId, pixels.slice());
};

export { snapshotOwned };
