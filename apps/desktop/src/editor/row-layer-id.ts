/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import { ROW_SELECTOR, TOGGLES_SELECTOR } from './row-layer-id.constants';

const rowLayerId = (target: EventTarget, allowToggles: boolean): LayerId | null => {
  if (!(target instanceof HTMLElement)) return null;
  if (!allowToggles && target.closest(TOGGLES_SELECTOR)) return null;
  const key = target.closest<HTMLElement>(ROW_SELECTOR)?.dataset.reorderKey;
  return key === undefined ? null : (key as LayerId);
};

export { rowLayerId };
