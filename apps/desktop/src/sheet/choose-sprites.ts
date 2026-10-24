/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useToolStore } from '../stores/useToolStore';
import { currentScene } from './current-scene';
import type { PickResult } from './sheet.type';

const carryLayer = (previous: string | null): void => {
  const layers = currentScene()?.active?.layers ?? [];
  const same = previous === null ? undefined : layers.find((layer) => nameKey(layer.name) === nameKey(previous));
  useToolStore.getState().setLayer(same?.id ?? null);
};

const chooseSprites = (result: PickResult): void => {
  const sprites = useSpriteStore.getState();
  const before = currentTarget();
  sprites.setSelection(result.selected, result.anchor);
  if (result.active === null || result.active === before?.sprite.id) return;
  sprites.setActive(result.active);
  carryLayer(before?.layer.name ?? null);
};

export { chooseSprites };
