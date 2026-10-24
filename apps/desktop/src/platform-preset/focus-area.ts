/* @layer renderer-app @kind logic */
import type { FrameId, SpriteId } from '@bxel/document';
import { chooseSprites } from '../sheet/choose-sprites';
import { useTimelineStore } from '../stores/useTimelineStore';
import type { AreaHighlight } from './platform-preset.type';

const focusArea = (area: AreaHighlight): void => {
  const id = area.spriteId as SpriteId;
  chooseSprites({ selected: [id], anchor: id, active: id });
  const frame = Object.keys(area.frames)[0];
  if (frame !== undefined) useTimelineStore.getState().setFrame(frame as FrameId);
};

export { focusArea };
