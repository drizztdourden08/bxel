/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { FRAME_BAR_TEXT } from '../FrameBar.constants';

const spriteStep = (sprite: Sprite | undefined): string => {
  if (!sprite) return FRAME_BAR_TEXT.empty;
  return sprite.role === 'sprite' ? FRAME_BAR_TEXT.shared(sprite.name) : FRAME_BAR_TEXT.owned(sprite.name);
};

export { spriteStep };
