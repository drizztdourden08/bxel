/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { chooseSprites } from '../sheet/choose-sprites';
import type { AreaHighlight } from './platform-preset.type';

const focusArea = (area: AreaHighlight): void => {
  const id = area.spriteId as SpriteId;
  chooseSprites({ selected: [id], anchor: id, active: id });
};

export { focusArea };
