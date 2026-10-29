/* @layer renderer-app @kind logic */
import { moveAnimations } from '../../../sheet-manager/move-animations';
import { pickAnimation } from '../../../sheet-manager/pick-animation';
import { pickVisible } from '../../../sheet-manager/pick-visible';
import { reorderSprites } from '../../../sheet/reorder-sprites';
import { ARROW_STEP } from '../SpritesPanel.constants';
import type { KeyAction, KeyShape, ManagerModel } from '../SpritesPanel.type';

const viewKeys = (model: ManagerModel): string[] => [...model.order, ...model.animations.map((fact) => fact.key)];

const positionOf = (model: ManagerModel, keys: readonly string[]): number => {
  const lastStrip = model.picked.at(-1);
  if (lastStrip !== undefined && model.ids.length === 0) return keys.indexOf(lastStrip);
  return keys.findIndex((key) => key === model.scene.active?.id);
};

const walk = (model: ManagerModel, target: number, range: boolean): void => {
  const keys = viewKeys(model);
  const next = keys[Math.min(keys.length - 1, Math.max(0, target))];
  if (next === undefined) return;
  const how = range ? 'range' : 'replace';
  if (model.animations.some((fact) => fact.key === next)) pickAnimation(keys, next, how);
  else pickVisible(model.order, next as (typeof model.order)[number], how);
};

const stepOf = (key: string, columns: number): number | null => {
  if (key === 'ArrowUp') return -columns;
  if (key === 'ArrowDown') return columns;
  return ARROW_STEP[key] ?? null;
};

const reorder = (model: ManagerModel, step: number): void => {
  reorderSprites(model.ids, { by: step });
  moveAnimations(model.picked, step, model.sheet?.id ?? null);
};

const navAction = (event: KeyShape, model: ManagerModel, columns: number): KeyAction | null => {
  const keys = viewKeys(model);
  const at = positionOf(model, keys);
  if (event.key === 'Home') return () => walk(model, 0, event.shiftKey);
  if (event.key === 'End') return () => walk(model, keys.length - 1, event.shiftKey);
  const step = stepOf(event.key, columns);
  if (step === null) return null;
  if (event.altKey) return () => reorder(model, step);
  return () => walk(model, at + step, event.shiftKey);
};

export { navAction };
