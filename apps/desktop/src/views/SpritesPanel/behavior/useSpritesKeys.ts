/* @layer renderer-app @kind hook */
import type { SpriteId } from '@bxel/document';
import { deleteSprites } from '../../../sheet/delete-sprites';
import { pickSpriteById } from '../../../sheet/pick-sprite-by-id';
import { reorderSprites } from '../../../sheet/reorder-sprites';
import { selectionIds } from '../../../sheet/selection-ids';
import type { SpriteScene } from '../../../sheet/sheet.type';
import { ARROW_STEP } from '../SpritesPanel.constants';
import type { KeyAction, SpriteKeyHandler } from '../SpritesPanel.type';

const walk = (scene: SpriteScene, step: number, range: boolean): void => {
  const at = scene.sprites.findIndex((sprite) => sprite.id === scene.active?.id);
  const next = scene.sprites[at + step];
  if (next) pickSpriteById(next.id, range ? 'range' : 'replace');
};

const arrowAction = (event: { altKey: boolean; shiftKey: boolean; key: string }, scene: SpriteScene): KeyAction | null => {
  const step = ARROW_STEP[event.key];
  if (step === undefined) return null;
  return event.altKey ? () => reorderSprites(selectionIds(scene), { by: step }) : () => walk(scene, step, event.shiftKey);
};

const keyAction = (event: { altKey: boolean; shiftKey: boolean; key: string }, scene: SpriteScene, rename: KeyAction): KeyAction | null => {
  if (event.key === 'F2') return rename;
  if (event.key === 'Delete') return () => deleteSprites(selectionIds(scene));
  return arrowAction(event, scene);
};

const useSpritesKeys = (scene: SpriteScene | null, begin: (spriteId: SpriteId) => void): SpriteKeyHandler => (event) => {
  const active = scene?.active;
  if (!scene || !active || event.target instanceof HTMLInputElement) return;
  const action = keyAction(event, scene, () => begin(active.id));
  if (!action) return;
  event.preventDefault();
  action();
};

export { useSpritesKeys };
