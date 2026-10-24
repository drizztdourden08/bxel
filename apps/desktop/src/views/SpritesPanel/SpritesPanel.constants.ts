/* @layer renderer-app @kind constants */
import type { SpriteId } from '@bxel/document';

const SPRITES_TEXT = {
  empty: 'No sprite is open.',
  title: (count: number, selected: number): string => (selected > 1 ? `Sprites (${count}), ${selected} selected` : `Sprites (${count})`),
  list: 'Sprites',
  actions: 'Sprite actions',
  renameLabel: 'Sprite name',
  renameHint: 'Press Enter to keep the name or Escape to cancel.',
  add: 'New sprite',
  addKey: 'Ctrl+Shift+N',
  duplicate: 'Duplicate sprite',
  duplicateKey: 'Ctrl+Shift+D',
  remove: 'Delete sprite',
  cancelRemove: 'Keep the sprites',
  earlier: 'Move earlier',
  earlierKey: 'Alt+Left',
  later: 'Move later',
  laterKey: 'Alt+Right',
  rename: 'Rename sprite',
  renameKey: 'F2',
  tile: (name: string, width: number, height: number): string => `${name}, ${width} by ${height}`,
} as const;

const NO_SPRITES: readonly SpriteId[] = [];

const DRAG_TYPE = 'application/x-bxel-sprite';

const ARROW_STEP: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };

export { ARROW_STEP, DRAG_TYPE, NO_SPRITES, SPRITES_TEXT };
