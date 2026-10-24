/* @layer renderer-app @kind logic */
import { pickVisible } from '../../../sheet-manager/pick-visible';
import { reorderSprites } from '../../../sheet/reorder-sprites';
import { ARROW_STEP } from '../SpritesPanel.constants';
import type { KeyAction, KeyShape, ManagerModel } from '../SpritesPanel.type';

const walk = (model: ManagerModel, target: number, range: boolean): void => {
  const clamped = Math.min(model.order.length - 1, Math.max(0, target));
  const next = model.order[clamped];
  if (next) pickVisible(model.order, next, range ? 'range' : 'replace');
};

const stepOf = (key: string, columns: number): number | null => {
  if (key === 'ArrowUp') return -columns;
  if (key === 'ArrowDown') return columns;
  return ARROW_STEP[key] ?? null;
};

const navAction = (event: KeyShape, model: ManagerModel, columns: number): KeyAction | null => {
  const at = model.order.findIndex((id) => id === model.scene.active?.id);
  if (event.key === 'Home') return () => walk(model, 0, event.shiftKey);
  if (event.key === 'End') return () => walk(model, model.order.length - 1, event.shiftKey);
  const step = stepOf(event.key, columns);
  if (step === null) return null;
  if (event.altKey) return () => reorderSprites(model.ids, { by: step });
  return () => walk(model, at + step, event.shiftKey);
};

export { navAction };
